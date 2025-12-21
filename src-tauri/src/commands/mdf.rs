//! MDF4 file loading and parsing commands.

use crate::decode::decode_frame;
use crate::dto::{CanFrameDto, DecodedSignalDto};
use crate::state::AppState;
use std::sync::Arc;
use tauri::State;

/// Load an MDF4 file and extract CAN frames.
#[tauri::command]
pub async fn load_mdf4(
    path: String,
    state: State<'_, Arc<AppState>>,
) -> Result<(Vec<CanFrameDto>, Vec<DecodedSignalDto>), String> {
    let mdf =
        mdf4_rs::MDF::from_file(&path).map_err(|e| format!("Failed to open MDF4: {:?}", e))?;

    let mut frames = Vec::new();
    let mut decoded_signals = Vec::new();
    let dbc_guard = state.dbc.lock().unwrap();

    for cg in mdf.channel_groups() {
        let channels = cg.channels();
        let channel_name = cg.name().ok().flatten().unwrap_or_default().to_string();

        // Check if this is a CAN_DataFrame composite channel
        if channel_name == "CAN_DataFrame" {
            // Find Timestamp and CAN_DataFrame channels
            let mut timestamp_ch = None;
            let mut dataframe_ch = None;

            for ch in channels.iter() {
                let name = ch.name().ok().flatten().unwrap_or_default();
                if name == "Timestamp" {
                    timestamp_ch = Some(ch);
                } else if name == "CAN_DataFrame" {
                    dataframe_ch = Some(ch);
                }
            }

            if let (Some(ts_ch), Some(df_ch)) = (timestamp_ch, dataframe_ch) {
                let timestamps = ts_ch.values().unwrap_or_default();
                let dataframes = df_ch.values().unwrap_or_default();

                for (i, (ts_opt, df_opt)) in timestamps.iter().zip(dataframes.iter()).enumerate() {
                    let timestamp = ts_opt
                        .as_ref()
                        .and_then(|v| v.as_f64())
                        .unwrap_or(i as f64 * 0.001);

                    if let Some(mdf4_rs::DecodedValue::ByteArray(bytes)) = df_opt {
                        if bytes.len() < 8 {
                            continue;
                        }

                        // Try to parse CAN_DataFrame - multiple formats exist:
                        // 1. Standard ASAM: BusChannel(1) + Flags(1) + Reserved(2) + ID(4) + Data
                        // 2. Some tools: ID(4) + DLC(1) + Flags(1) + Data(8)
                        // 3. OBD2 logger: Metadata(4) + ISO-TP frame data

                        // Check if this looks like ISO-TP OBD2 data (byte 3 or 4 contains valid PCI)
                        let pci_byte3 = bytes[3];
                        let is_isotp_single = (pci_byte3 & 0xF0) == 0x00 && (pci_byte3 & 0x0F) <= 7;

                        let (can_id, dlc, data) = if is_isotp_single && bytes.len() >= 8 {
                            // ISO-TP single frame format in MDF: metadata bytes + CAN frame data
                            // The CAN frame data starts at byte 3 (PCI byte) and includes up to 8 bytes
                            // DBC signals are defined relative to the full CAN frame, so include PCI byte

                            // Check if byte 4 looks like an OBD2 response (service byte = 0x41-0x4F)
                            if bytes.len() > 4 && (0x41..=0x4F).contains(&bytes[4]) {
                                // OBD2 response - use standard response ID 0x7E8
                                // Extract CAN frame data starting from PCI byte (byte 3), pad to 8 bytes
                                let mut frame_data = vec![0u8; 8];
                                let src_end = bytes.len().min(11);
                                let copy_len = (src_end - 3).min(8);
                                frame_data[..copy_len].copy_from_slice(&bytes[3..3 + copy_len]);
                                (0x7E8_u32, 8_u8, frame_data)
                            } else {
                                // Not a recognized OBD response, skip
                                continue;
                            }
                        } else if bytes.len() >= 14 {
                            // Try standard ASAM format: bytes 4-7 as CAN_ID
                            let raw_id = u32::from_le_bytes([bytes[4], bytes[5], bytes[6], bytes[7]]);

                            // Check if ID looks valid (11-bit or 29-bit range)
                            if raw_id <= 0x7FF || (raw_id > 0x7FF && raw_id <= 0x1FFFFFFF) {
                                let dlc = bytes.get(1).map(|b| b & 0x0F).unwrap_or(8).min(8);
                                let data: Vec<u8> = bytes[8..bytes.len().min(8 + dlc as usize)].to_vec();
                                (raw_id, dlc, data)
                            } else {
                                // ID out of range, try alternative: first 4 bytes
                                let alt_id = u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]);
                                if alt_id <= 0x1FFFFFFF {
                                    let dlc = bytes.get(5).map(|b| *b).unwrap_or(8).min(8);
                                    let data: Vec<u8> = bytes[6..bytes.len().min(6 + dlc as usize)].to_vec();
                                    (alt_id, dlc, data)
                                } else {
                                    continue;
                                }
                            }
                        } else {
                            continue;
                        };

                        let frame = CanFrameDto::from_mdf4(
                            timestamp,
                            channel_name.clone(),
                            can_id,
                            dlc,
                            data,
                        );

                        if let Some(ref dbc) = *dbc_guard {
                            decoded_signals.extend(decode_frame(&frame, dbc));
                        }

                        frames.push(frame);
                    }
                }
            }
            continue;
        }

        // Standard format: separate ID, Data, DLC channels
        let mut time_idx = None;
        let mut id_idx = None;
        let mut data_idx = None;
        let mut dlc_idx = None;

        for (i, cn) in channels.iter().enumerate() {
            let name = cn.name().ok().flatten().unwrap_or_default().to_lowercase();
            if name.contains("time") || name.contains("timestamp") {
                time_idx = Some(i);
            } else if name.contains("id") || name.contains("arbitration") {
                id_idx = Some(i);
            } else if name.contains("data") || name.contains("databytes") {
                data_idx = Some(i);
            } else if name.contains("dlc") || name.contains("length") {
                dlc_idx = Some(i);
            }
        }

        if let (Some(id_i), Some(data_i)) = (id_idx, data_idx) {
            if let (Some(id_ch), Some(data_ch)) = (channels.get(id_i), channels.get(data_i)) {
                let id_values = id_ch.values().unwrap_or_default();
                let data_values = data_ch.values().unwrap_or_default();
                let time_values = time_idx
                    .and_then(|i| channels.get(i))
                    .and_then(|ch| ch.values().ok())
                    .unwrap_or_default();
                let dlc_values = dlc_idx
                    .and_then(|i| channels.get(i))
                    .and_then(|ch| ch.values().ok())
                    .unwrap_or_default();

                for (rec_idx, id_val) in id_values.iter().enumerate() {
                    let timestamp = time_values
                        .get(rec_idx)
                        .and_then(|v| v.as_ref())
                        .and_then(|v| v.as_f64())
                        .unwrap_or(rec_idx as f64 * 0.001);

                    let can_id = id_val.as_ref().and_then(|v| v.as_f64()).unwrap_or(0.0) as u32;

                    let dlc = dlc_values
                        .get(rec_idx)
                        .and_then(|v| v.as_ref())
                        .and_then(|v| v.as_f64())
                        .unwrap_or(8.0) as u8;

                    let data: Vec<u8> = data_values
                        .get(rec_idx)
                        .and_then(|v| v.as_ref())
                        .map(|v| match v {
                            mdf4_rs::DecodedValue::ByteArray(bytes) => {
                                bytes.iter().take(dlc as usize).cloned().collect()
                            }
                            _ => vec![0u8; dlc as usize],
                        })
                        .unwrap_or_else(|| vec![0u8; dlc as usize]);

                    let frame =
                        CanFrameDto::from_mdf4(timestamp, channel_name.clone(), can_id, dlc, data);

                    if let Some(ref dbc) = *dbc_guard {
                        decoded_signals.extend(decode_frame(&frame, dbc));
                    }

                    frames.push(frame);
                }
            }
        }
    }

    if frames.is_empty() {
        return Err("No CAN data found in MDF4 file".to_string());
    }

    Ok((frames, decoded_signals))
}
