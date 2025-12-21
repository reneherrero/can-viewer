//! Frontend integration tests - runs TypeScript tests via npm.

use std::process::Command;

#[test]
fn frontend_tests() {
    let output = Command::new("npm")
        .args(["run", "test:run"])
        .output()
        .expect("Failed to run npm test. Is npm installed?");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    println!("{}", stdout);
    if !stderr.is_empty() {
        eprintln!("{}", stderr);
    }

    assert!(
        output.status.success(),
        "Frontend tests failed with exit code: {:?}",
        output.status.code()
    );
}
