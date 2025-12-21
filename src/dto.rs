//! Data Transfer Objects for frontend communication.
//!
//! These types are serializable versions of internal types, used for
//! communication between the Rust backend and the JavaScript frontend.

use embedded_can::Id;
use serde::{Deserialize, Serialize};

/// Serializable CAN frame for frontend communication.
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
    /// Create from socketcan frame with metadata.
    #[cfg(target_os = "linux")]
    pub fn from_socketcan(frame: &socketcan::CanFrame, timestamp: f64, channel: &str) -> Self {
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

    /// Create from MDF4 channel data.
    pub fn from_mdf4(
        timestamp: f64,
        channel: String,
        can_id: u32,
        dlc: u8,
        data: Vec<u8>,
    ) -> Self {
        Self {
            timestamp,
            channel,
            can_id,
            is_extended: can_id > 0x7FF,
            is_remote: false,
            dlc,
            data,
        }
    }
}

/// Serializable decoded signal for frontend communication.
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
    /// Convert from dbc_rs::DecodedSignal, adding timestamp and message name.
    pub fn from_dbc_signal(
        sig: &dbc_rs::DecodedSignal<'_>,
        timestamp: f64,
        message_name: &str,
    ) -> Self {
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
