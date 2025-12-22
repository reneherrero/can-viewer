//! CAN Viewer - A Tauri application for viewing CAN bus data.
//!
//! Supports:
//! - Live capture from SocketCAN interfaces (Linux)
//! - Loading MDF4 measurement files
//! - DBC-based signal decoding

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod config;
mod decode;
mod dto;
mod state;

use clap::Parser;
use state::{AppState, InitialFiles};
use std::sync::Arc;

/// CAN Data Viewer with MDF4 and SocketCAN support.
#[derive(Parser, Debug)]
#[command(author, version, about)]
struct Args {
    /// DBC file to load on startup
    #[arg(short, long)]
    dbc: Option<String>,

    /// MDF4 file to load on startup
    #[arg(short, long)]
    mdf4: Option<String>,
}

fn main() {
    let args = Args::parse();

    let initial_files = InitialFiles {
        dbc_path: args.dbc,
        mdf4_path: args.mdf4,
    };

    let app_state = Arc::new(AppState::with_initial_files(initial_files));

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            commands::load_dbc,
            commands::clear_dbc,
            commands::get_dbc_path,
            commands::decode_single_frame,
            commands::decode_frames,
            commands::get_dbc_info,
            commands::load_mdf4,
            commands::export_logs,
            commands::list_can_interfaces,
            commands::start_capture,
            commands::stop_capture,
            commands::is_capture_running,
            commands::get_initial_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
