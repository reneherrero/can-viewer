//! CAN Viewer Library
//!
//! Core functionality for the CAN Viewer application.
//! This library can be used by the main binary or extended by pro versions.

pub mod commands;
pub mod config;
pub mod decode;
pub mod dto;
pub mod live_capture;
pub mod state;

// Re-export commonly used types
pub use state::{AppState, InitialFiles};

// Re-export filter types and utilities for use by pro crate
pub use commands::filter::{
    parse_data_pattern, match_data_pattern,
    FilterConfig, FilterResult, FrameStats, MessageCount, MatchStatus, DlcDetectionResult,
};

// Re-export MDF4 parsing utilities
pub use commands::mdf::parse_can_dataframe;
