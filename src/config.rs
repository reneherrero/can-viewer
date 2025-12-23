//! Session configuration persistence.
//!
//! Saves and loads user session settings like the last used DBC file.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Embedded sample files for first run
const SAMPLE_MF4: &[u8] = include_bytes!("../examples/sample.mf4");
const SAMPLE_DBC: &[u8] = include_bytes!("../examples/sample.dbc");

/// Session configuration that persists across app restarts.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct SessionConfig {
    /// Path to the last loaded DBC file.
    pub dbc_path: Option<String>,
    /// Path to the last loaded MDF4 file.
    pub mdf4_path: Option<String>,
}

impl SessionConfig {
    /// Get the config directory for the application.
    pub fn config_dir() -> Option<PathBuf> {
        dirs::config_dir().map(|p| p.join("can-viewer"))
    }

    /// Get the config file path for the application.
    pub fn config_path() -> Option<PathBuf> {
        Self::config_dir().map(|p| p.join("session.json"))
    }

    /// Load session config from disk, extracting samples on first run.
    pub fn load() -> Self {
        let config_path = Self::config_path();
        let is_first_run = config_path.as_ref().is_none_or(|p| !p.exists());

        if is_first_run {
            if let Some(config) = Self::setup_first_run() {
                return config;
            }
        }

        config_path
            .and_then(|path| fs::read_to_string(&path).ok())
            .and_then(|content| serde_json::from_str(&content).ok())
            .unwrap_or_default()
    }

    /// Setup for first run: extract sample files and create initial config.
    fn setup_first_run() -> Option<Self> {
        let config_dir = Self::config_dir()?;
        fs::create_dir_all(&config_dir).ok()?;

        // Extract sample files
        let mf4_path = config_dir.join("sample.mf4");
        let dbc_path = config_dir.join("sample.dbc");

        fs::write(&mf4_path, SAMPLE_MF4).ok()?;
        fs::write(&dbc_path, SAMPLE_DBC).ok()?;

        // Create config pointing to samples
        let config = Self {
            dbc_path: Some(dbc_path.to_string_lossy().into_owned()),
            mdf4_path: Some(mf4_path.to_string_lossy().into_owned()),
        };
        config.save().ok()?;

        Some(config)
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
