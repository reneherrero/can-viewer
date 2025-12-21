use std::process::Command;

fn main() {
    // Build frontend (TypeScript + Vite)
    println!("cargo:rerun-if-changed=frontend/");
    println!("cargo:rerun-if-changed=package.json");

    let status = Command::new("npm")
        .args(["run", "build"])
        .status()
        .expect("Failed to run npm build. Is npm installed?");

    if !status.success() {
        panic!("Frontend build failed");
    }

    tauri_build::build()
}
