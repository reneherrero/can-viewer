//! CAN frame decoding using DBC definitions.

use crate::dto::{CanFrameDto, DecodedSignalDto};
use dbc_rs::Dbc;

/// Decode a CAN frame using dbc-rs, returning serializable DTOs.
pub fn decode_frame(frame: &CanFrameDto, dbc: &Dbc) -> Vec<DecodedSignalDto> {
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
