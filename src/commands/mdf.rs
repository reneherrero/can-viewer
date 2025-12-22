//! MDF4 file loading, parsing, and export commands.

use crate::decode::decode_frame;
use crate::dto::{CanFrameDto, DecodedSignalDto};
use crate::state::AppState;
use mdf4_rs::can::{FdFlags, RawCanLogger};
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
        let group_name = cg.name().ok().flatten().unwrap_or_default().to_string();

        // Find Timestamp and CAN_DataFrame channels in this group
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

        // Check if this group has a CAN_DataFrame channel (ASAM MDF4 CAN format)
        if dataframe_ch.is_some() {
            if let (Some(ts_ch), Some(df_ch)) = (timestamp_ch, dataframe_ch) {
                let timestamps = ts_ch.values().unwrap_or_default();
                let dataframes = df_ch.values().unwrap_or_default();

                for (i, (ts_opt, df_opt)) in timestamps.iter().zip(dataframes.iter()).enumerate() {
                    let timestamp = ts_opt
                        .as_ref()
                        .and_then(|v| v.as_f64())
                        .unwrap_or(i as f64 * 0.001);

                    if let Some(mdf4_rs::DecodedValue::ByteArray(bytes)) = df_opt {
                        if bytes.len() < 5 {
                            continue;
                        }

                        // Parse CAN_DataFrame - common format:
                        // Bytes 0-3: CAN ID (little-endian, may include extended flag)
                        // Byte 4: DLC
                        // Bytes 5+: Data (DLC bytes)
                        let raw_id = u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]);
                        let dlc = bytes.get(4).copied().unwrap_or(8).min(8);

                        // Extract CAN ID (mask off any flags in upper bits for 29-bit IDs)
                        let can_id = raw_id & 0x1FFFFFFF;

                        // Extract data bytes
                        let data_start = 5;
                        let data_end = (data_start + dlc as usize).min(bytes.len());
                        let data: Vec<u8> = if data_end > data_start {
                            bytes[data_start..data_end].to_vec()
                        } else {
                            vec![0u8; dlc as usize]
                        };

                        let frame = CanFrameDto::from_mdf4(
                            timestamp,
                            group_name.clone(),
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

        // Standard format: separate ID, Data, DLC channels (fallback)
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
                        CanFrameDto::from_mdf4(timestamp, group_name.clone(), can_id, dlc, data);

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

/// Export CAN frames to an MDF4 file.
///
/// Takes a list of frames and writes them to the specified path as an MDF4 file.
#[tauri::command]
pub async fn export_logs(path: String, frames: Vec<CanFrameDto>) -> Result<usize, String> {
    if frames.is_empty() {
        return Err("No frames to export".to_string());
    }

    let mut logger =
        RawCanLogger::new().map_err(|e| format!("Failed to create logger: {:?}", e))?;

    for frame in &frames {
        // Convert timestamp from seconds to microseconds
        let timestamp_us = (frame.timestamp * 1_000_000.0) as u64;

        if frame.is_fd {
            // CAN FD frame
            let flags = FdFlags::new(frame.brs, frame.esi);
            if frame.is_extended {
                logger.log_fd_extended(frame.can_id, timestamp_us, &frame.data, flags);
            } else {
                logger.log_fd(frame.can_id, timestamp_us, &frame.data, flags);
            }
        } else {
            // Classic CAN frame
            if frame.is_extended {
                logger.log_extended(frame.can_id, timestamp_us, &frame.data);
            } else {
                logger.log(frame.can_id, timestamp_us, &frame.data);
            }
        }
    }

    let mdf_bytes = logger
        .finalize()
        .map_err(|e| format!("Failed to finalize MDF4: {:?}", e))?;

    std::fs::write(&path, &mdf_bytes).map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(frames.len())
}
