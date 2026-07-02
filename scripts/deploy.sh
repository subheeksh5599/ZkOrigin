#!/bin/bash
# zkOrigin deployment script for Stellar testnet
# Prerequisites: stellar CLI installed, funded testnet account
set -euo pipefail

NETWORK="${1:-testnet}"
WASM_PATH="contracts/zk-origin/target/wasm32-unknown-unknown/release/zk_origin.wasm"

echo "=== zkOrigin Deploy to Stellar ${NETWORK} ==="

if [ ! -f "$WASM_PATH" ]; then
    echo "Building contract..."
    cd contracts/zk-origin && cargo build --target wasm32-unknown-unknown --release
    cd ../..
fi

echo "Contract WASM: $(ls -lah $WASM_PATH)"

echo ""
echo "Deploy command:"
echo "  stellar contract deploy \\"
echo "    --wasm $WASM_PATH \\"
echo "    --source <YOUR_SECRET_KEY> \\"
echo "    --network $NETWORK"
echo ""
echo "After deploy, copy the contract ID and run:"
echo "  ./scripts/invoke.sh <CONTRACT_ID>"

echo ""
echo "To initialize:"
echo "  stellar contract invoke \\"
echo "    --id <CONTRACT_ID> \\"
echo "    --source admin \\"
echo "    --network $NETWORK \\"
echo "    -- __constructor \\"
echo "    --admin <ADMIN_PUBLIC_KEY>"
