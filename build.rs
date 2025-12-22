fn main() {
    // Fail early if dist is missing (helpful error for publishers)
    if !std::path::Path::new("dist/index.html").exists() {
        panic!(
            "\n\
            ══════════════════════════════════════════════════════════════\n\
            ERROR: dist/ folder missing\n\
            \n\
            Run `npm run build` first to build the frontend.\n\
            \n\
            For development: `npx tauri dev` (builds frontend automatically)\n\
            For publishing:  `npm run build && cargo publish`\n\
            ══════════════════════════════════════════════════════════════\n"
        );
    }

    tauri_build::build()
}
