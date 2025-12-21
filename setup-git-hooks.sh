#!/bin/bash
# Setup script to install git hooks
#
# This script configures git to use the .githooks directory for hooks.
# The pre-commit hook runs TypeScript and Rust quality checks before
# allowing commits.

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
GITHOOKS_DIR="$REPO_ROOT/.githooks"

if [ ! -d "$GITHOOKS_DIR" ]; then
    echo "Error: .githooks directory not found"
    exit 1
fi

if [ ! -f "$GITHOOKS_DIR/pre-commit" ]; then
    echo "Error: pre-commit hook not found in .githooks/"
    exit 1
fi

# Configure git to use the .githooks directory
git config core.hooksPath .githooks

echo "✓ Git hooks configured successfully"
echo ""
echo "The pre-commit hook will now run the following checks:"
echo "  - TypeScript lint (eslint)"
echo "  - TypeScript type check (tsc)"
echo "  - TypeScript tests (vitest)"
echo "  - Rust tests (cargo test)"
echo "  - Clippy (cargo clippy)"
echo "  - Rust formatting (cargo fmt)"
echo "  - Frontend build (npm run build)"
echo ""
echo "To skip the hook, use: git commit --no-verify"
