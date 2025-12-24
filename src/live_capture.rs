//! Live capture display state.
//!
//! Handles signal decoding and statistics for live display.
//! MDF4 logging happens in the socket thread for lossless capture.

use crate::decode::{decode_frame, DecodeResult};
use crate::dto::{CanFrameDto, CaptureStatsDto, LiveCaptureUpdate, StatsHtml};
use dbc_rs::Dbc;
use std::collections::{HashMap, VecDeque};
use std::time::Instant;

/// Maximum recent frames to keep for the frame stream view.
const MAX_RECENT_FRAMES: usize = 100;

/// Internal message monitor entry.
struct MessageEntry {
    can_id: u32,
    message_name: String,
    data: Vec<u8>,
    dlc: u8,
    count: u64,
    last_update: f64,
    // For rate calculation
    last_count: u64,
    last_rate_time: f64,
    rate: f64,
}

/// Internal signal monitor entry.
struct SignalEntry {
    signal_name: String,
    message_name: String,
    value: f64,
    unit: String,
    last_update: f64,
}

/// Live capture display state - manages data for live display only.
///
/// MDF4 logging happens separately in the socket thread.
/// This struct is NOT thread-safe - owned by a single processor thread.
pub struct LiveCaptureState {
    // Display file path (for UI)
    capture_file: String,

    // Monitors
    messages: HashMap<u32, MessageEntry>,
    signals: HashMap<String, SignalEntry>,

    // Recent frames ring buffer
    recent_frames: VecDeque<CanFrameDto>,

    // Statistics
    frame_count: u64,
    start_time: Instant,

    // DBC for decoding and message names
    dbc: Option<Dbc>,

    // Rate calculation
    last_rate_update: Instant,
    last_frame_count: u64,
    frame_rate: f64,
}

impl LiveCaptureState {
    /// Create new display state.
    pub fn new(capture_file: String, dbc: Option<Dbc>) -> Self {
        Self {
            capture_file,
            messages: HashMap::new(),
            signals: HashMap::new(),
            recent_frames: VecDeque::with_capacity(MAX_RECENT_FRAMES),
            frame_count: 0,
            start_time: Instant::now(),
            dbc,
            last_rate_update: Instant::now(),
            last_frame_count: 0,
            frame_rate: 0.0,
        }
    }

    /// Process a received frame for display (decodes, updates monitors).
    pub fn process_frame(&mut self, frame: CanFrameDto) {
        let timestamp = frame.timestamp;

        // Update frame count
        self.frame_count += 1;

        // Update message monitor
        self.update_message_monitor(&frame, timestamp);

        // Decode and update signal monitor
        self.decode_and_update_signals(&frame, timestamp);

        // Add to recent frames ring buffer
        if self.recent_frames.len() >= MAX_RECENT_FRAMES {
            self.recent_frames.pop_front();
        }
        self.recent_frames.push_back(frame);
    }

    /// Update message monitor with new frame.
    fn update_message_monitor(&mut self, frame: &CanFrameDto, timestamp: f64) {
        let message_name = self.get_message_name(frame.can_id);

        if let Some(entry) = self.messages.get_mut(&frame.can_id) {
            entry.data = frame.data.clone();
            entry.dlc = frame.dlc;
            entry.count += 1;
            entry.last_update = timestamp;
        } else {
            self.messages.insert(
                frame.can_id,
                MessageEntry {
                    can_id: frame.can_id,
                    message_name,
                    data: frame.data.clone(),
                    dlc: frame.dlc,
                    count: 1,
                    last_update: timestamp,
                    last_count: 0,
                    last_rate_time: timestamp,
                    rate: 0.0,
                },
            );
        }
    }

    /// Decode frame and update signal monitor.
    fn decode_and_update_signals(&mut self, frame: &CanFrameDto, timestamp: f64) {
        let Some(ref dbc) = self.dbc else { return };

        match decode_frame(frame, dbc) {
            DecodeResult::Signals(signals) => {
                for signal in signals {
                    let key = format!("{}.{}", signal.message_name, signal.signal_name);
                    if let Some(entry) = self.signals.get_mut(&key) {
                        entry.value = signal.value;
                        entry.last_update = timestamp;
                    } else {
                        self.signals.insert(
                            key,
                            SignalEntry {
                                signal_name: signal.signal_name.clone(),
                                message_name: signal.message_name.clone(),
                                value: signal.value,
                                unit: signal.unit.clone(),
                                last_update: timestamp,
                            },
                        );
                    }
                }
            }
            DecodeResult::Error(_) => {
                // Ignore decode errors for now
            }
        }
    }

    /// Get message name from DBC or return "-".
    fn get_message_name(&self, can_id: u32) -> String {
        if let Some(ref dbc) = self.dbc {
            if let Some(msg) = dbc.messages().find_by_id(can_id) {
                return msg.name().to_string();
            }
        }
        "-".to_string()
    }

    /// Update rates for all messages (call periodically).
    pub fn update_rates(&mut self) {
        let now = Instant::now();
        let elapsed = now.duration_since(self.last_rate_update).as_secs_f64();

        if elapsed >= 0.5 {
            // Update overall frame rate
            let frame_delta = self.frame_count - self.last_frame_count;
            self.frame_rate = frame_delta as f64 / elapsed;
            self.last_frame_count = self.frame_count;

            // Update per-message rates
            let current_time = self.start_time.elapsed().as_secs_f64();
            for entry in self.messages.values_mut() {
                let count_delta = entry.count - entry.last_count;
                let time_delta = current_time - entry.last_rate_time;
                if time_delta > 0.0 {
                    entry.rate = count_delta as f64 / time_delta;
                }
                entry.last_count = entry.count;
                entry.last_rate_time = current_time;
            }

            self.last_rate_update = now;
        }
    }

    /// Generate update for frontend with pre-rendered HTML.
    pub fn generate_update(&self) -> LiveCaptureUpdate {
        let elapsed = self.start_time.elapsed().as_secs_f64();

        let stats = CaptureStatsDto {
            frame_count: self.frame_count,
            message_count: self.messages.len() as u32,
            signal_count: self.signals.len() as u32,
            frame_rate: self.frame_rate,
            elapsed_secs: elapsed,
            capture_file: Some(self.capture_file.clone()),
        };

        // Pre-render messages HTML (sorted by CAN ID)
        let mut messages: Vec<_> = self.messages.values().collect();
        messages.sort_by_key(|e| e.can_id);
        let messages_html = messages
            .iter()
            .map(|e| {
                let id_hex = format!("{:03X}", e.can_id);
                let data_hex = e
                    .data
                    .iter()
                    .map(|b| format!("{:02X}", b))
                    .collect::<Vec<_>>()
                    .join(" ");
                format!(
                    "<tr><td class=\"cv-cell-id\">0x{}</td><td class=\"cv-cell-name\">{}</td><td class=\"cv-cell-data\">{}</td><td>{}</td><td>{:.1}/s</td></tr>",
                    id_hex, e.message_name, data_hex, e.count, e.rate
                )
            })
            .collect::<Vec<_>>()
            .join("");

        // Pre-render signals HTML (grouped by message with header rows)
        let mut signals: Vec<_> = self.signals.values().collect();
        signals.sort_by(|a, b| {
            a.message_name
                .cmp(&b.message_name)
                .then_with(|| a.signal_name.cmp(&b.signal_name))
        });

        let mut signals_html = String::new();
        let mut current_message: Option<&str> = None;
        for e in &signals {
            // Add group header when message changes
            if current_message != Some(&e.message_name) {
                signals_html.push_str(&format!(
                    "<tr class=\"cv-group-header\"><td colspan=\"3\">{}</td></tr>",
                    e.message_name
                ));
                current_message = Some(&e.message_name);
            }

            let value_str = if e.value.fract() == 0.0 {
                format!("{}", e.value as i64)
            } else {
                format!("{:.3}", e.value)
            };
            signals_html.push_str(&format!(
                "<tr><td class=\"cv-cell-signal\">{}</td><td class=\"cv-cell-value\">{}</td><td class=\"cv-cell-unit\">{}</td></tr>",
                e.signal_name, value_str, e.unit
            ));
        }

        // Pre-render frames HTML (ring buffer already limited to MAX_RECENT_FRAMES)
        let frames_html = self
            .recent_frames
            .iter()
            .take(MAX_RECENT_FRAMES) // Safety limit
            .map(|f| {
                let id_hex = format!("{:03X}", f.can_id);
                let data_hex = f
                    .data
                    .iter()
                    .map(|b| format!("{:02X}", b))
                    .collect::<Vec<_>>()
                    .join(" ");
                let flags = Self::format_flags(f);
                format!(
                    "<tr><td class=\"cv-cell-dim\">{:.6}</td><td class=\"cv-cell-id\">0x{}</td><td>{}</td><td class=\"cv-cell-data\">{}</td><td>{}</td></tr>",
                    f.timestamp, id_hex, f.dlc, data_hex, flags
                )
            })
            .collect::<Vec<_>>()
            .join("");

        // Pre-format stats
        let secs = elapsed as u64;
        let mins = secs / 60;
        let remaining_secs = secs % 60;
        let stats_html = StatsHtml {
            message_count: self.messages.len().to_string(),
            frame_count: self.frame_count.to_string(),
            frame_rate: format!("{:.0}/s", self.frame_rate),
            elapsed: format!("{}:{:02}", mins, remaining_secs),
        };

        LiveCaptureUpdate {
            stats,
            messages_html,
            signals_html,
            frames_html,
            stats_html,
            message_count: self.messages.len() as u32,
            signal_count: self.signals.len() as u32,
            frame_count: self.recent_frames.len(),
        }
    }

    /// Format CAN frame flags as string.
    fn format_flags(frame: &CanFrameDto) -> &'static str {
        match (frame.is_extended, frame.is_fd, frame.brs, frame.esi) {
            (false, false, false, false) => "-",
            (true, false, false, false) => "EXT",
            (false, true, false, false) => "FD",
            (false, true, true, false) => "FD, BRS",
            (false, true, false, true) => "FD, ESI",
            (false, true, true, true) => "FD, BRS, ESI",
            (true, true, false, false) => "EXT, FD",
            (true, true, true, false) => "EXT, FD, BRS",
            (true, true, false, true) => "EXT, FD, ESI",
            (true, true, true, true) => "EXT, FD, BRS, ESI",
            _ => "-",
        }
    }
}
