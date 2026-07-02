#!/bin/bash
# zkOrigin: One-command setup for the full development environment
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== zkOrigin Development Setup ===${NC}\n"

# 1. Install Rust if missing
if ! command -v cargo &>/dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

# 2. Add wasm target
rustup target add wasm32-unknown-unknown 2>/dev/null || echo "wasm32 target already installed"

# 3. Install Stellar CLI
if ! command -v stellar &>/dev/null; then
    echo "Installing Stellar CLI..."
    cargo install stellar-cli --features opt
fi

# 4. Install Noir
if ! command -v nargo &>/dev/null; then
    echo "Installing Noir..."
    curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
    source "$HOME/.nargo/env" 2>/dev/null || true
    noirup --version 0.36.0
fi

# 5. Install snarkjs (for proof artifact handling)
if ! command -v snarkjs &>/dev/null; then
    echo "Installing snarkjs..."
    npm install -g snarkjs 2>/dev/null || echo "snarkjs install skipped (npm required)"
fi

echo -e "\n${GREEN}Setup complete! Run 'make help' for available commands.${NC}"
echo -e "${CYAN}Next steps:${NC}"
echo "  1. make build       # Build the Soroban contract"
echo "  2. make test        # Run contract tests"
echo "  3. make circuits    # Compile Noir ZK circuits"
echo "  4. make circuit-tests  # Run circuit tests"
