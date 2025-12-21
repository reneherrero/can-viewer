//! SocketCAN capture commands (Linux only).

use crate::state::AppState;
use std::sync::Arc;
use tauri::State;

/// List available SocketCAN interfaces.
#[cfg(target_os = "linux")]
#[tauri::command]
pub async fn list_can_interfaces() -> Result<Vec<String>, String> {
    use std::fs;

    let mut interfaces = Vec::new();

    if let Ok(entries) = fs::read_dir("/sys/class/net") {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            let type_path = entry.path().join("type");

            // Type 280 is ARPHRD_CAN
            if let Ok(type_val) = fs::read_to_string(&type_path) {
                if type_val.trim() == "280" && !interfaces.contains(&name) {
                    interfaces.push(name.clone());
                }
            }

            // Also include vcan/can prefixed interfaces
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
pub async fn list_can_interfaces() -> Result<Vec<String>, String> {
    Err("SocketCAN is only available on Linux".to_string())
}

/// Start capturing CAN frames from an interface.
///
/// Uses SocketCAN for interface initialization and socket management.
/// Uses embedded_can traits for frame access during capture.
#[cfg(target_os = "linux")]
#[tauri::command]
pub async fn start_capture(
    interface: String,
    window: tauri::Window,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    use crate::decode::decode_frame;
    use crate::dto::CanFrameDto;
    use std::time::Instant;
    use tauri::Emitter;
    use tokio::sync::mpsc;

    // SocketCAN-specific: socket initialization and configuration
    use socketcan::{CanFdSocket, Socket};

    // Check if already running
    {
        if *state.capture_running.lock().unwrap() {
            return Err("Capture already running".to_string());
        }
    }

    // SocketCAN: Open CAN FD socket to receive both classic CAN and CAN FD frames
    let socket =
        CanFdSocket::open(&interface).map_err(|e| format!("Failed to open interface: {}", e))?;

    // SocketCAN: Configure socket for non-blocking I/O
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
        // embedded_can::blocking::Can trait for receiving frames
        use embedded_can::blocking::Can;

        let mut socket = socket;

        // Capture loop: uses embedded_can traits for frame access
        loop {
            if rx.try_recv().is_ok() {
                break;
            }

            // Use embedded_can::blocking::Can::receive() for frame reception
            // Frame conversion uses embedded_can::Frame trait methods
            match socket.receive() {
                Ok(frame) => {
                    let timestamp = start_time.elapsed().as_secs_f64();

                    // Convert using embedded_can::Frame trait
                    // Remote frames return None and are skipped
                    if let Some(frame_dto) =
                        CanFrameDto::from_any_frame(&frame, timestamp, &interface_name)
                    {
                        // Decode signals if DBC loaded
                        if let Some(ref dbc) = dbc_clone {
                            for signal in decode_frame(&frame_dto, dbc) {
                                let _ = window.emit("decoded-signal", &signal);
                            }
                        }

                        let _ = window.emit("can-frame", &frame_dto);
                    }
                }
                // Non-blocking socket returns WouldBlock when no data available
                Err(socketcan::Error::Io(ref e)) if e.kind() == std::io::ErrorKind::WouldBlock => {
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
pub async fn start_capture(
    _interface: String,
    _window: tauri::Window,
    _state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    Err("SocketCAN is only available on Linux".to_string())
}

/// Stop the current capture.
#[cfg(target_os = "linux")]
#[tauri::command]
pub async fn stop_capture(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    *state.capture_running.lock().unwrap() = false;
    let sender = state.capture_sender.lock().unwrap().take();
    if let Some(tx) = sender {
        let _ = tx.send(()).await;
    }
    Ok(())
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
pub async fn stop_capture(_state: State<'_, Arc<AppState>>) -> Result<(), String> {
    Err("SocketCAN is only available on Linux".to_string())
}

/// Check if a capture is currently running.
#[cfg(target_os = "linux")]
#[tauri::command]
pub async fn is_capture_running(state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    Ok(*state.capture_running.lock().unwrap())
}

#[cfg(not(target_os = "linux"))]
#[tauri::command]
pub async fn is_capture_running(_state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    Ok(false)
}
