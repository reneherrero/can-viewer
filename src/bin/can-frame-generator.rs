//! CAN Frame Generator
//!
//! Generates valid CAN frames according to a DBC specification and sends them via SocketCAN.
//! Also handles vcan interface setup for testing.
//!
//! Usage:
//!   can-frame-generator -i vcan0 -r 0.5
//!   can-frame-generator --setup-vcan          # Set up vcan0 interface (requires sudo)
//!   can-frame-generator --setup-vcan -i vcan1 # Set up a specific vcan interface
//!
//! Options:
//!   -i, --interface <NAME>  CAN interface (default: vcan0)
//!   -r, --rate <MBPS>       Target bit rate in Mbits/s (default: 0.5)
//!   -d, --duration <SECS>   Run duration in seconds (0 = infinite)
//!   -v, --verbose           Verbose output
//!   --setup-vcan            Set up the vcan interface (requires sudo)

use clap::Parser;
use dbc_rs::Dbc;
use rand::Rng;
use socketcan::{CanSocket, EmbeddedFrame, Socket, StandardId};
use std::process::Command;
use std::time::{Duration, Instant};

/// CAN Frame Generator - sends simulated vehicle CAN data
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// CAN interface name
    #[arg(short, long, default_value = "vcan0")]
    interface: String,

    /// Target bit rate in Mbits/s (0.01 to 8.0 for CAN FD)
    #[arg(short, long, default_value = "0.5")]
    rate: f64,

    /// Run duration in seconds (0 = infinite)
    #[arg(short, long, default_value = "0")]
    duration: u64,

    /// Verbose output
    #[arg(short, long)]
    verbose: bool,

    /// Set up the vcan interface (requires sudo)
    #[arg(long)]
    setup_vcan: bool,

    /// Print the embedded DBC to stdout (for use with can-viewer)
    #[arg(long)]
    print_dbc: bool,
}

/// The embedded DBC for generating realistic vehicle data
const DBC_CONTENT: &str = r#"VERSION "2.0"

NS_ :

BS_:

BU_: ECM TCM BCM ABS SENSOR

BO_ 256 EngineData : 8 ECM
 SG_ RPM : 7|16@0+ (0.25,0) [0|8000] "rpm" TCM BCM
 SG_ Temperature : 23|8@0- (1,-40) [-40|215] "C" TCM BCM ABS
 SG_ ThrottlePosition : 31|8@0+ (0.392157,0) [0|100] "%" *
 SG_ OilPressure : 32|16@1+ (0.01,0) [0|1000] "kPa" TCM

BO_ 512 TransmissionData : 8 TCM
 SG_ GearPosition : 7|8@0+ (1,0) [0|5] "" BCM
 SG_ ClutchEngaged : 8|1@0+ (1,0) [0|1] "" ECM
 SG_ Torque : 16|16@1- (0.1,0) [-3276.8|3276.7] "Nm" ECM BCM
 SG_ TransmissionTemp : 39|8@0- (1,-40) [-40|215] "C" ECM

BO_ 768 BrakeData : 6 ABS
 SG_ BrakePressure : 0|16@1+ (0.1,0) [0|1000] "bar" ECM BCM
 SG_ ABSActive : 16|1@0+ (1,0) [0|1] "" ECM
 SG_ WheelSpeedFL : 17|15@1+ (0.01,0) [0|327.67] "km/h" ECM
 SG_ WheelSpeedFR : 32|15@1+ (0.01,0) [0|327.67] "km/h" ECM

BO_ 1024 SensorData : 6 SENSOR
 SG_ Voltage : 7|16@0+ (0.01,0) [0|20] "V" ECM TCM
 SG_ Current : 23|16@0- (0.001,0) [-32.768|32.767] "A" ECM
 SG_ Humidity : 39|8@0+ (0.5,0) [0|127.5] "%" BCM
"#;

/// Average bits per CAN frame (header + 8 data bytes + stuff bits + CRC + EOF)
const BITS_PER_FRAME: f64 = 111.0;

/// Vehicle state simulator for generating realistic CAN traffic
struct VehicleSimulator {
    // Engine
    rpm: f64,
    temperature: f64,
    throttle: f64,
    oil_pressure: f64,

    // Transmission
    gear: f64,
    clutch: f64,
    torque: f64,
    trans_temp: f64,

    // Brakes
    brake_pressure: f64,
    abs_active: f64,
    wheel_speed_fl: f64,
    wheel_speed_fr: f64,

    // Sensors
    voltage: f64,
    current: f64,
    humidity: f64,

    // State
    driving: bool,
    braking: bool,
    rng: rand::rngs::ThreadRng,
}

impl VehicleSimulator {
    fn new() -> Self {
        Self {
            rpm: 800.0,
            temperature: 20.0,
            throttle: 0.0,
            oil_pressure: 100.0,
            gear: 0.0,
            clutch: 0.0,
            torque: 0.0,
            trans_temp: 20.0,
            brake_pressure: 0.0,
            abs_active: 0.0,
            wheel_speed_fl: 0.0,
            wheel_speed_fr: 0.0,
            voltage: 12.6,
            current: 0.0,
            humidity: 50.0,
            driving: false,
            braking: false,
            rng: rand::thread_rng(),
        }
    }

    fn step(&mut self) {
        // Random state changes
        if self.rng.r#gen::<f64>() < 0.001 {
            self.driving = !self.driving;
        }
        if self.rng.r#gen::<f64>() < 0.01 {
            self.braking = self.rng.r#gen::<f64>() < 0.3;
        }

        // Engine simulation
        let target_rpm = if self.driving {
            self.rng.gen_range(1500.0..6500.0)
        } else {
            self.rng.gen_range(700.0..900.0)
        };
        self.throttle = if self.driving {
            self.rng.gen_range(20.0..80.0)
        } else {
            self.rng.gen_range(0.0..5.0)
        };

        self.rpm += (target_rpm - self.rpm) * 0.1;
        self.rpm = self.rpm.clamp(0.0, 8000.0);

        let target_temp = if self.rpm > 1000.0 { 85.0 } else { 30.0 };
        self.temperature += (target_temp - self.temperature) * 0.001;
        self.temperature = self.temperature.clamp(-40.0, 87.0);

        self.oil_pressure = 50.0 + (self.rpm / 8000.0) * 400.0 + self.rng.gen_range(-10.0..10.0);
        self.oil_pressure = self.oil_pressure.clamp(0.0, 655.0);

        // Transmission
        if self.driving {
            let speed = self.wheel_speed_fl;
            self.gear = if speed < 20.0 {
                1.0
            } else if speed < 40.0 {
                2.0
            } else if speed < 60.0 {
                3.0
            } else if speed < 100.0 {
                4.0
            } else {
                5.0
            };
            self.clutch = 0.0;
        } else {
            self.gear = 0.0;
            self.clutch = 0.0;
        }

        // Torque
        if self.driving && self.gear > 0.0 {
            self.torque = self.throttle * 30.0 * (1.0 / self.gear.max(1.0));
        } else {
            self.torque = 0.0;
        }
        self.torque += self.rng.gen_range(-20.0..20.0);
        self.torque = self.torque.clamp(-3276.8, 3276.7);

        self.trans_temp += (self.temperature * 0.8 - self.trans_temp) * 0.001;
        self.trans_temp = self.trans_temp.clamp(-40.0, 87.0);

        // Brakes
        if self.braking {
            self.brake_pressure = self.rng.gen_range(50.0..200.0);
            self.abs_active = if self.rng.r#gen::<f64>() < 0.1 {
                1.0
            } else {
                0.0
            };
        } else {
            self.brake_pressure = 0.0;
            self.abs_active = 0.0;
        }

        // Wheel speeds
        let target_speed = if self.driving && !self.braking {
            self.throttle * 2.0
        } else if self.braking {
            self.wheel_speed_fl * 0.95
        } else {
            0.0
        };

        self.wheel_speed_fl += (target_speed - self.wheel_speed_fl) * 0.05;
        self.wheel_speed_fr = self.wheel_speed_fl + self.rng.gen_range(-2.0..2.0);
        self.wheel_speed_fl = self.wheel_speed_fl.clamp(0.0, 327.67);
        self.wheel_speed_fr = self.wheel_speed_fr.clamp(0.0, 327.67);

        // Electrical
        self.voltage = 12.6 + self.rng.gen_range(-0.5..0.5);
        self.current = self.rng.gen_range(-10.0..20.0);
        self.humidity = 50.0 + self.rng.gen_range(-10.0..10.0);
    }

    fn engine_signals(&self) -> Vec<(&'static str, f64)> {
        vec![
            ("RPM", self.rpm),
            ("Temperature", self.temperature),
            ("ThrottlePosition", self.throttle),
            ("OilPressure", self.oil_pressure),
        ]
    }

    fn transmission_signals(&self) -> Vec<(&'static str, f64)> {
        vec![
            ("GearPosition", self.gear),
            ("ClutchEngaged", self.clutch),
            ("Torque", self.torque),
            ("TransmissionTemp", self.trans_temp),
        ]
    }

    fn brake_signals(&self) -> Vec<(&'static str, f64)> {
        vec![
            ("BrakePressure", self.brake_pressure),
            ("ABSActive", self.abs_active),
            ("WheelSpeedFL", self.wheel_speed_fl),
            ("WheelSpeedFR", self.wheel_speed_fr),
        ]
    }

    fn sensor_signals(&self) -> Vec<(&'static str, f64)> {
        vec![
            ("Voltage", self.voltage),
            ("Current", self.current),
            ("Humidity", self.humidity),
        ]
    }
}

/// Set up a virtual CAN interface
fn setup_vcan(interface: &str) -> Result<(), Box<dyn std::error::Error>> {
    eprintln!("Setting up vcan interface: {}", interface);

    // Step 1: Load the vcan kernel module
    eprintln!("  Loading vcan kernel module...");
    let output = Command::new("sudo").args(["modprobe", "vcan"]).output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to load vcan module: {}", stderr).into());
    }
    eprintln!("    ✓ vcan module loaded");

    // Step 2: Check if interface already exists
    let output = Command::new("ip")
        .args(["link", "show", interface])
        .output()?;

    if output.status.success() {
        eprintln!("    ✓ Interface {} already exists", interface);
    } else {
        // Create the interface
        eprintln!("  Creating interface {}...", interface);
        let output = Command::new("sudo")
            .args(["ip", "link", "add", "dev", interface, "type", "vcan"])
            .output()?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("Failed to create {}: {}", interface, stderr).into());
        }
        eprintln!("    ✓ Interface {} created", interface);
    }

    // Step 3: Bring the interface up
    eprintln!("  Bringing interface {} up...", interface);
    let output = Command::new("sudo")
        .args(["ip", "link", "set", "up", interface])
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to bring up {}: {}", interface, stderr).into());
    }
    eprintln!("    ✓ Interface {} is up", interface);

    // Verify the interface is working
    let output = Command::new("ip")
        .args(["link", "show", interface])
        .output()?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        if stdout.contains("state UP") || stdout.contains("state UNKNOWN") {
            eprintln!("\n  ✓ {} is ready for use", interface);
        } else {
            eprintln!("\n  ⚠ {} exists but may not be fully up", interface);
        }
    }

    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Handle --print-dbc mode
    if args.print_dbc {
        print!("{}", DBC_CONTENT);
        return Ok(());
    }

    // Handle vcan setup mode
    if args.setup_vcan {
        return setup_vcan(&args.interface);
    }

    // Validate rate (CAN FD supports up to 8 Mbit/s)
    let rate_mbps = args.rate.clamp(0.01, 8.0);
    let bits_per_second = rate_mbps * 1_000_000.0;
    let target_frames_per_second = bits_per_second / BITS_PER_FRAME;
    let frame_interval = Duration::from_secs_f64(1.0 / target_frames_per_second);

    eprintln!("CAN Frame Generator");
    eprintln!("  Interface: {}", args.interface);
    eprintln!("  Target rate: {:.3} Mbits/s", rate_mbps);
    eprintln!("  Target frames/s: {:.0}", target_frames_per_second);
    eprintln!("  Frame interval: {:?}", frame_interval);
    if args.duration > 0 {
        eprintln!("  Duration: {}s", args.duration);
    } else {
        eprintln!("  Duration: infinite (Ctrl+C to stop)");
    }
    eprintln!();

    // Open CAN socket
    let socket = match CanSocket::open(&args.interface) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("Failed to open {}: {}", args.interface, e);
            eprintln!();
            eprintln!("Hint: Try running with --setup-vcan first:");
            eprintln!("  can-frame-generator --setup-vcan -i {}", args.interface);
            return Err(e.into());
        }
    };
    eprintln!("Opened {} socket", args.interface);

    // Parse DBC
    let dbc = Dbc::parse(DBC_CONTENT)?;

    // Initialize simulator
    let mut sim = VehicleSimulator::new();

    // Message scheduling: each message type has its own period
    let message_configs: [(u32, u8); 4] = [
        (256, 8),  // EngineData
        (512, 8),  // TransmissionData
        (768, 6),  // BrakeData
        (1024, 6), // SensorData
    ];
    let mut msg_index = 0;

    let start_time = Instant::now();
    let mut frames_sent: u64 = 0;
    let mut last_report = Instant::now();
    let mut next_frame_time = Instant::now();

    eprintln!("Sending frames...");

    loop {
        // Check duration limit
        if args.duration > 0 && start_time.elapsed().as_secs() >= args.duration {
            break;
        }

        // Wait for next frame time
        let now = Instant::now();
        if now < next_frame_time {
            std::thread::sleep(next_frame_time - now);
        }
        next_frame_time = Instant::now() + frame_interval;

        // Update simulation
        sim.step();

        // Get signals for current message
        let (can_id, dlc) = message_configs[msg_index];
        let signals = match can_id {
            256 => sim.engine_signals(),
            512 => sim.transmission_signals(),
            768 => sim.brake_signals(),
            1024 => sim.sensor_signals(),
            _ => vec![],
        };

        // Encode and send frame
        match dbc.encode(can_id, &signals, false) {
            Ok(payload) => {
                // Create CAN frame
                let id = StandardId::new(can_id as u16).unwrap();
                let data = &payload.as_slice()[..dlc as usize];
                let frame = socketcan::CanDataFrame::new(id, data).unwrap();

                // Send frame
                if let Err(e) = socket.write_frame(&frame) {
                    eprintln!("Send error: {}", e);
                } else {
                    frames_sent += 1;

                    if args.verbose {
                        let data_hex: String = data.iter().map(|b| format!("{:02X}", b)).collect();
                        eprintln!("  {:03X}#{}", can_id, data_hex);
                    }
                }
            }
            Err(e) => {
                eprintln!("Encode error for {:03X}: {:?}", can_id, e);
            }
        }

        // Cycle to next message type
        msg_index = (msg_index + 1) % message_configs.len();

        // Report progress every second
        if last_report.elapsed() >= Duration::from_secs(1) {
            let elapsed = start_time.elapsed().as_secs_f64();
            let actual_rate = (frames_sent as f64 * BITS_PER_FRAME) / elapsed / 1_000_000.0;
            eprintln!(
                "  Sent {} frames | {:.3} Mbits/s | {:.0} frames/s",
                frames_sent,
                actual_rate,
                frames_sent as f64 / elapsed
            );
            last_report = Instant::now();
        }
    }

    let elapsed = start_time.elapsed().as_secs_f64();
    let actual_rate = (frames_sent as f64 * BITS_PER_FRAME) / elapsed / 1_000_000.0;

    eprintln!();
    eprintln!("Done!");
    eprintln!("  Total frames: {}", frames_sent);
    eprintln!("  Elapsed time: {:.2}s", elapsed);
    eprintln!("  Average rate: {:.3} Mbits/s", actual_rate);
    eprintln!("  Average frames/s: {:.0}", frames_sent as f64 / elapsed);

    Ok(())
}
