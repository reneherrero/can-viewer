# can-viewer

> **⚠️ Work in Progress**: This project is under active development and not yet ready for production use.

A desktop application for viewing and analyzing CAN bus data from MDF4 files and live SocketCAN interfaces.

[![License](https://img.shields.io/crates/l/can-viewer.svg)](LICENSE)

## Features

- **MDF4 File Support** - Load and view CAN data from MDF4 files
- **DBC Decoding** - Decode CAN signals using DBC database files
- **Live Capture** - Capture CAN frames from SocketCAN interfaces (Linux)
- **Cross-platform UI** - Built with Tauri for native performance

## Quick Start

```bash
# Clone the repository
git clone https://github.com/reneherrero/can-viewer.git
cd can-viewer

# Build and run
cd src-tauri
cargo run

# Or with files
cargo run -- -d path/to/file.dbc -m path/to/recording.mf4
```

## Command Line Options

```
can-viewer [OPTIONS]

Options:
  -d, --dbc <PATH>    DBC file to load on startup
  -m, --mdf4 <PATH>   MDF4 file to load on startup
  -h, --help          Print help
```

## Requirements

- Rust 1.85+
- Linux (for SocketCAN support)
- WebKit2GTK (for Tauri on Linux)

## Dependencies

- [mdf4-rs](https://github.com/reneherrero/mdf4-rs) - MDF4 file parsing
- [dbc-rs](https://github.com/reneherrero/dbc-rs) - DBC file parsing
- [Tauri](https://tauri.app) - Desktop application framework

## License

MIT OR Apache-2.0. See [LICENSING.md](LICENSING.md).
