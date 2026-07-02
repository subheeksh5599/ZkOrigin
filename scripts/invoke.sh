#!/bin/bash
# Invoke zkOrigin contract functions on testnet
set -euo pipefail

CID="${1:?Usage: $0 <CONTRACT_ID> [function] [args...]}"
FUNC="${2:-total_proofs}"
NETWORK="${NETWORK:-testnet}"

echo "=== Invoking $FUNC on contract $CID ==="

case "$FUNC" in
    total_proofs|admin|is_paused)
        stellar contract invoke \
            --id "$CID" \
            --network "$NETWORK" \
            -- "$FUNC"
        ;;
    get_attestor)
        ATTESTOR="${3:?Usage: $0 <CID> get_attestor <ATTESTOR_ADDR>}"
        stellar contract invoke \
            --id "$CID" \
            --network "$NETWORK" \
            -- get_attestor \
            --attestor_addr "$ATTESTOR"
        ;;
    is_nullifier_spent)
        NF="${3:?Usage: $0 <CID> is_nullifier_spent <NULLIFIER_HEX>}"
        stellar contract invoke \
            --id "$CID" \
            --network "$NETWORK" \
            -- is_nullifier_spent \
            --nullifier "$NF"
        ;;
    get_payment_receipt)
        PID="${3:?Usage: $0 <CID> get_payment_receipt <PAYMENT_ID>}"
        stellar contract invoke \
            --id "$CID" \
            --network "$NETWORK" \
            -- get_payment_receipt \
            --id "$PID"
        ;;
    *)
        echo "Unknown function: $FUNC"
        echo "Available: total_proofs, admin, is_paused, get_attestor, is_nullifier_spent, get_payment_receipt"
        exit 1
        ;;
esac
