# CAN Viewer Examples

This directory contains sample files for testing CAN Viewer.

## Files

- `sample.mf4` - Sample MDF4 file with CAN frames (Engine RPM, Vehicle Speed, Throttle Position)
- `sample.dbc` - Sample DBC file with message and signal definitions

## Usage

### Load MDF4 file on startup

```bash
can-viewer --mdf4 examples/sample.mf4
```

### Load DBC file on startup

```bash
can-viewer --dbc examples/sample.dbc
```

### Load both files on startup

```bash
can-viewer --dbc examples/sample.dbc --mdf4 examples/sample.mf4
```

### Short options

```bash
can-viewer -d examples/sample.dbc -m examples/sample.mf4
```

## Running from source

```bash
cargo run -- --dbc examples/sample.dbc --mdf4 examples/sample.mf4
```
