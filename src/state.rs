//! Application state management.

use dbc_rs::Dbc;
use std::sync::Mutex;
use tokio::sync::mpsc;

/// Initial file paths from command line arguments.
#[derive(Default)]
pub struct InitialFiles {
    pub dbc_path: Option<String>,
    pub mdf4_path: Option<String>,
}

/// Global application state shared across Tauri commands.
pub struct AppState {
    /// Loaded DBC database for signal decoding.
    pub dbc: Mutex<Option<Dbc>>,

    /// Initial files from command line.
    pub initial_files: Mutex<InitialFiles>,

    /// Whether a SocketCAN capture is currently running.
    #[cfg(target_os = "linux")]
    pub capture_running: Mutex<bool>,

    /// Channel to signal capture thread to stop.
    #[cfg(target_os = "linux")]
    pub capture_sender: Mutex<Option<mpsc::Sender<()>>>,
}

impl AppState {
    pub fn with_initial_files(initial_files: InitialFiles) -> Self {
        Self {
            dbc: Mutex::new(None),
            initial_files: Mutex::new(initial_files),
            #[cfg(target_os = "linux")]
            capture_running: Mutex::new(false),
            #[cfg(target_os = "linux")]
            capture_sender: Mutex::new(None),
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            dbc: Mutex::new(None),
            initial_files: Mutex::new(InitialFiles::default()),
            #[cfg(target_os = "linux")]
            capture_running: Mutex::new(false),
            #[cfg(target_os = "linux")]
            capture_sender: Mutex::new(None),
        }
    }
}
