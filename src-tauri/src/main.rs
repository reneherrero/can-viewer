// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dbc_rs::Dbc;
use embedded_can::Id;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{Emitter, State};
use tokio::sync::mpsc;

/// Serializable CAN frame for frontend communication.
/// Converts from embedded-can Frame types at the Tauri boundary.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CanFrameDto {
    pub timestamp: f64,
    pub channel: String,
    pub can_id: u32,
    pub is_extended: bool,
    pub is_remote: bool,
    pub dlc: u8,
    pub data: Vec<u8>,
}

impl CanFrameDto {
    /// Create from socketcan frame with metadata
    #[cfg(target_os = "linux")]
    fn from_socketcan(frame: &socketcan::CanFrame, timestamp: f64, channel: &str) -> Self {
        use socketcan::EmbeddedFrame;
        Self {
            timestamp,
            channel: channel.to_string(),
            can_id: match frame.id() {
                Id::Standard(id) => id.as_raw() as u32,
                Id::Extended(id) => id.as_raw(),
            },
            is_extended: frame.is_extended(),
            is_remote: frame.is_remote_frame(),
            dlc: frame.dlc() as u8,
            data: frame.data().to_vec(),
        }
    }

}

/// Serializable decoded signal for frontend communication.
/// Converts from dbc_rs::DecodedSignal (which has lifetime parameters).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DecodedSignalDto {
    pub timestamp: f64,
    pub message_name: String,
    pub signal_name: String,
    pub value: f64,
    pub raw_value: i64,
    pub unit: String,
    pub description: Option<String>,
}

impl DecodedSignalDto {
    /// Convert from dbc_rs::DecodedSignal, adding timestamp and message name
    fn from_dbc_signal(sig: &dbc_rs::DecodedSignal<'_>, timestamp: f64, message_name: &str) -> Self {
        Self {
            timestamp,
            message_name: message_name.to_string(),
            signal_name: sig.name.to_string(),
            value: sig.value,
            raw_value: sig.raw_value,
            unit: sig.unit.unwrap_or("").to_string(),
            description: sig.description.map(|s| s.to_string()),
        }
    }
}

// Application state
struct AppState {
    dbc: Mutex<Option<Dbc>>,
    #[cfg(target_os = "linux")]
    capture_running: Mutex<bool>,
    #[cfg(target_os = "linux")]
    capture_sender: Mutex<Option<mpsc::Sender<()>>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            dbc: Mutex::new(None),
            #[cfg(target_os = "linux")]
            capture_running: Mutex::new(false),
            #[cfg(target_os = "linux")]
            capture_sender: Mutex::new(None),
        }
    }
}

/// Decode a CAN frame using dbc-rs, returning serializable DTOs
fn decode_frame_dto(frame: &CanFrameDto, dbc: &Dbc) -> Vec<DecodedSignalDto> {
    // Use dbc-rs decode with raw parameters
    let Ok(decoded) = dbc.decode(frame.can_id, &frame.data, frame.is_extended) else {
        return Vec::new();
    };

    // Get message name for the signals
    let message_name = dbc
        .messages()
        .find_by_id(if frame.is_extended {
            frame.can_id | 0x80000000
        } else {
            frame.can_id
        })
        .map(|m| m.name())
        .unwrap_or("Unknown");

    decoded
        .iter()
        .map(|sig| DecodedSignalDto::from_dbc_signal(sig, frame.timestamp, message_name))
        .collect()
}

// Load and parse DBC file
#[tauri::command]
async fn load_dbc(path: String, state: State<'_, Arc<AppState>>) -> Result<String, String> {
    let content =
        std::fs::read_to_string(&path).map_err(|e| format!("Failed to read DBC: {}", e))?;

    let dbc = Dbc::parse(&content).map_err(|e| format!("Failed to parse DBC: {:?}", e))?;

    let msg_count = dbc.messages().len();
    *state.dbc.lock().unwrap() = Some(dbc);

    Ok(format!("Loaded {} messages", msg_count))
}

// Clear DBC data
#[tauri::command]
async fn clear_dbc(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    *state.dbc.lock().unwrap() = None;
    Ok(())
}

// Load MDF4 file and extract CAN frames
#[tauri::command]
async fn load_mdf4(
    path: String,
    state: State<'_, Arc<AppState>>,
) -> Result<(Vec<CanFrameDto>, Vec<DecodedSignalDto>), String> {
    let mdf =
        mdf4_rs::MDF::from_file(&path).map_err(|e| format!("Failed to open MDF4: {:?}", e))?;

    let mut frames = Vec::new();
    let mut decoded_signals = Vec::new();
    let dbc_guard = state.dbc.lock().unwrap();

    // Iterate through channel groups to find CAN data
    for cg in mdf.channel_groups() {
        let channels = cg.channels();

        // Find relevant channels by name
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

        // Extract CAN data if we found ID and data channels
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

                let channel_name = cg.name().ok().flatten().unwrap_or_default().to_string();

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

                    let frame = CanFrameDto {
                        timestamp,
                        channel: channel_name.clone(),
                        can_id,
                        is_extended: can_id > 0x7FF,
                        is_remote: false,
                        dlc,
                        data,
                    };

                    // Decode signals if DBC is loaded
                    if let Some(ref dbc) = *dbc_guard {
                        decoded_signals.extend(decode_frame_dto(&frame, dbc));
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

// List available SocketCAN interfaces (Linux only)
#[cfg(target_os = "linux")]
#[tauri::command]
async fn list_can_interfaces() -> Result<Vec<String>, String> {
    use std::fs;

    let mut interfaces = Vec::new();

    if let Ok(entries) = fs::read_dir("/sys/class/net") {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            let type_path = entry.path().join("type");
            if let Ok(type_val) = fs::read_to_string(&type_path) {
                if type_val.trim() == "280" && !interfaces.contains(&name) {
                    interfaces.push(name.clone());
                }
            }
            if (name.starts_with("vcan") || name.starts_with("can")) && !interfaces.contains(&name)
            {
                interfaces.push(name);
            }
        }
    }

    Ok(interfaces)
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
async fn list_can_interfaces() -> Result<Vec<String>, String> {
    Err("SocketCAN is only available on Linux".to_string())
}

// Start CAN capture (Linux only)
#[cfg(target_os = "linux")]
#[tauri::command]
async fn start_capture(
    interface: String,
    window: tauri::Window,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    use socketcan::{CanSocket, Socket};
    use std::time::Instant;

    {
        if *state.capture_running.lock().unwrap() {
            return Err("Capture already running".to_string());
        }
    }

    let socket =
        CanSocket::open(&interface).map_err(|e| format!("Failed to open interface: {}", e))?;
    socket
        .set_nonblocking(true)
        .map_err(|e| format!("Failed to set non-blocking: {}", e))?;

    let (tx, mut rx) = mpsc::channel::<()>(1);
    *state.capture_sender.lock().unwrap() = Some(tx);
    *state.capture_running.lock().unwrap() = true;

    let dbc_clone = state.dbc.lock().unwrap().clone();
    let interface_name = interface.clone();
    let start_time = Instant::now();

    std::thread::spawn(move || {
        loop {
            if rx.try_recv().is_ok() {
                break;
            }

            match socket.read_frame() {
                Ok(frame) => {
                    let timestamp = start_time.elapsed().as_secs_f64();
                    let frame_dto = CanFrameDto::from_socketcan(&frame, timestamp, &interface_name);

                    // Decode signals if DBC loaded
                    if let Some(ref dbc) = dbc_clone {
                        for signal in decode_frame_dto(&frame_dto, dbc) {
                            let _ = window.emit("decoded-signal", &signal);
                        }
                    }

                    let _ = window.emit("can-frame", &frame_dto);
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    std::thread::sleep(std::time::Duration::from_millis(1));
                }
                Err(e) => {
                    let _ = window.emit("capture-error", format!("Read error: {}", e));
                    break;
                }
            }
        }
    });

    Ok(())
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
async fn start_capture(
    _interface: String,
    _window: tauri::Window,
    _state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    Err("SocketCAN is only available on Linux".to_string())
}

#[cfg(target_os = "linux")]
#[tauri::command]
async fn stop_capture(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    *state.capture_running.lock().unwrap() = false;
    let sender = state.capture_sender.lock().unwrap().take();
    if let Some(tx) = sender {
        let _ = tx.send(()).await;
    }
    Ok(())
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
async fn stop_capture(_state: State<'_, Arc<AppState>>) -> Result<(), String> {
    Err("SocketCAN is only available on Linux".to_string())
}

#[cfg(target_os = "linux")]
#[tauri::command]
async fn is_capture_running(state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    Ok(*state.capture_running.lock().unwrap())
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
async fn is_capture_running(_state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    Ok(false)
}

#[tauri::command]
async fn decode_single_frame(
    frame: CanFrameDto,
    state: State<'_, Arc<AppState>>,
) -> Result<Vec<DecodedSignalDto>, String> {
    let dbc_guard = state.dbc.lock().unwrap();
    Ok(dbc_guard
        .as_ref()
        .map(|dbc| decode_frame_dto(&frame, dbc))
        .unwrap_or_default())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(Arc::new(AppState::default()))
        .invoke_handler(tauri::generate_handler![
            load_dbc,
            clear_dbc,
            load_mdf4,
            list_can_interfaces,
            start_capture,
            stop_capture,
            is_capture_running,
            decode_single_frame,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
