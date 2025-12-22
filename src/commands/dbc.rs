//! DBC file loading and management commands.

use crate::decode::decode_frame;
use crate::dto::{CanFrameDto, DecodedSignalDto};
use crate::state::AppState;
use dbc_rs::Dbc;
use serde::Serialize;
use std::sync::Arc;
use tauri::State;

/// Signal definition from DBC.
#[derive(Debug, Clone, Serialize)]
pub struct SignalInfo {
    pub name: String,
    pub start_bit: u32,
    pub length: u32,
    pub factor: f64,
    pub offset: f64,
    pub min: f64,
    pub max: f64,
    pub unit: String,
}

/// Message definition from DBC.
#[derive(Debug, Clone, Serialize)]
pub struct MessageInfo {
    pub id: u32,
    pub name: String,
    pub dlc: u8,
    pub sender: String,
    pub signals: Vec<SignalInfo>,
}

/// Full DBC structure for display.
#[derive(Debug, Clone, Serialize)]
pub struct DbcInfo {
    pub messages: Vec<MessageInfo>,
}

/// Load and parse a DBC file.
/// Saves the path to session config for persistence.
#[tauri::command]
pub async fn load_dbc(path: String, state: State<'_, Arc<AppState>>) -> Result<String, String> {
    let content =
        std::fs::read_to_string(&path).map_err(|e| format!("Failed to read DBC: {}", e))?;

    let dbc = Dbc::parse(&content).map_err(|e| format!("Failed to parse DBC: {:?}", e))?;

    let msg_count = dbc.messages().len();
    *state.dbc.lock().unwrap() = Some(dbc);
    *state.dbc_path.lock().unwrap() = Some(path.clone());

    // Save to session config for persistence
    if let Err(e) = state
        .session
        .lock()
        .unwrap()
        .set_dbc_path(Some(path.clone()))
    {
        eprintln!("Warning: Failed to save session: {}", e);
    }

    Ok(format!("Loaded {} messages", msg_count))
}

/// Clear the loaded DBC data.
/// Removes from session config.
#[tauri::command]
pub async fn clear_dbc(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    *state.dbc.lock().unwrap() = None;
    *state.dbc_path.lock().unwrap() = None;

    // Clear from session config
    if let Err(e) = state.session.lock().unwrap().set_dbc_path(None) {
        eprintln!("Warning: Failed to save session: {}", e);
    }

    Ok(())
}

/// Get the path to the currently loaded DBC file.
#[tauri::command]
pub async fn get_dbc_path(state: State<'_, Arc<AppState>>) -> Result<Option<String>, String> {
    Ok(state.dbc_path.lock().unwrap().clone())
}

/// Decode a single CAN frame using the loaded DBC.
#[tauri::command]
pub async fn decode_single_frame(
    frame: CanFrameDto,
    state: State<'_, Arc<AppState>>,
) -> Result<Vec<DecodedSignalDto>, String> {
    let dbc_guard = state.dbc.lock().unwrap();
    Ok(dbc_guard
        .as_ref()
        .map(|dbc| decode_frame(&frame, dbc))
        .unwrap_or_default())
}

/// Decode multiple CAN frames using the loaded DBC.
#[tauri::command]
pub async fn decode_frames(
    frames: Vec<CanFrameDto>,
    state: State<'_, Arc<AppState>>,
) -> Result<Vec<DecodedSignalDto>, String> {
    let dbc_guard = state.dbc.lock().unwrap();
    let Some(ref dbc) = *dbc_guard else {
        return Ok(Vec::new());
    };

    let signals: Vec<DecodedSignalDto> = frames
        .iter()
        .flat_map(|frame| decode_frame(frame, dbc))
        .collect();

    Ok(signals)
}

/// Get information about the loaded DBC.
#[tauri::command]
pub async fn get_dbc_info(state: State<'_, Arc<AppState>>) -> Result<Option<DbcInfo>, String> {
    let dbc_guard = state.dbc.lock().unwrap();
    let Some(ref dbc) = *dbc_guard else {
        return Ok(None);
    };

    let messages: Vec<MessageInfo> = dbc
        .messages()
        .iter()
        .map(|msg| {
            let signals: Vec<SignalInfo> = msg
                .signals()
                .iter()
                .map(|sig| SignalInfo {
                    name: sig.name().to_string(),
                    start_bit: sig.start_bit() as u32,
                    length: sig.length() as u32,
                    factor: sig.factor(),
                    offset: sig.offset(),
                    min: sig.min(),
                    max: sig.max(),
                    unit: sig.unit().unwrap_or("").to_string(),
                })
                .collect();

            MessageInfo {
                id: msg.id(),
                name: msg.name().to_string(),
                dlc: msg.dlc(),
                sender: msg.sender().to_string(),
                signals,
            }
        })
        .collect();

    Ok(Some(DbcInfo { messages }))
}
