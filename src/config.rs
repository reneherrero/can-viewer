//! Session configuration persistence.
//!
//! Saves and loads user session settings like the last used DBC file.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Session configuration that persists across app restarts.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct SessionConfig {
    /// Path to the last loaded DBC file.
    pub dbc_path: Option<String>,
    /// Path to the last loaded MDF4 file.
    pub mdf4_path: Option<String>,
}

impl SessionConfig {
    /// Get the config file path for the application.
    pub fn config_path() -> Option<PathBuf> {
        dirs::config_dir().map(|p| p.join("can-viewer").join("session.json"))
    }

    /// Load session config from disk.
    pub fn load() -> Self {
        Self::config_path()
            .and_then(|path| fs::read_to_string(&path).ok())
            .and_then(|content| serde_json::from_str(&content).ok())
            .unwrap_or_default()
    }

    /// Save session config to disk.
    pub fn save(&self) -> Result<(), String> {
        let path = Self::config_path().ok_or("Could not determine config directory")?;

        // Create config directory if it doesn't exist
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize: {}", e))?;

        fs::write(&path, content).map_err(|e| format!("Failed to write config: {}", e))?;

        Ok(())
    }

    /// Update DBC path and save.
    pub fn set_dbc_path(&mut self, path: Option<String>) -> Result<(), String> {
        self.dbc_path = path;
        self.save()
    }

    /// Update MDF4 path and save.
    pub fn set_mdf4_path(&mut self, path: Option<String>) -> Result<(), String> {
        self.mdf4_path = path;
        self.save()
    }
}
