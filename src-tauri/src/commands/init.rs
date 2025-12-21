//! Initialization commands.

use crate::state::AppState;
use serde::Serialize;
use std::sync::Arc;
use tauri::State;

/// Initial files response for frontend.
#[derive(Serialize)]
pub struct InitialFilesResponse {
    pub dbc_path: Option<String>,
    pub mdf4_path: Option<String>,
}

/// Get initial files specified via command line arguments.
#[tauri::command]
pub async fn get_initial_files(
    state: State<'_, Arc<AppState>>,
) -> Result<InitialFilesResponse, String> {
    let files = state.initial_files.lock().unwrap();
    Ok(InitialFilesResponse {
        dbc_path: files.dbc_path.clone(),
        mdf4_path: files.mdf4_path.clone(),
    })
}
