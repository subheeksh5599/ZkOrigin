# zkOrigin

Cryptographic payment provenance on Stellar. Freelancers and gig workers prove their income is clean before their bank account gets frozen. Scammers cannot.

Built for **Stellar Hacks: Real-World ZK**, June 2026.

---

## Problem

When tainted money enters a crypto payment chain, every innocent downstream receiver gets their bank account frozen — guilty until proven innocent, with no cryptographic way to prove otherwise.

## Solution

Zero-knowledge Groth16 proofs verified on-chain via Stellar's BN254 host functions. Each payment carries a proof that anchors, auditors, and regulators can cryptographically verify without seeing underlying identity data.

---

## Architecture

| Layer | Stack |
|---|---|
| ZK Circuits | Noir DSL (3 circuits: wallet_age, kyc_attestation, provenance) |
| Proving System | Groth16 over BN254 (arkworks + Soroban pairing_check) |
| On-Chain Verifier | Soroban smart contract (Rust, soroban-sdk 26.x) |
| Proof Client | Rust binary (ark-groth16 + ark-bn254) |
| Frontend | React 19 + GSAP + Tailwind v4 |
| Wallet | Freighter browser extension |
| Network | Stellar Testnet |

**Deployed contract:** `CC2RQTAM5OVTXEMRPD4LR22CMKXWQIFFUUWQQVKRFETSKYB6D6UAT2M3`
[View on Explorer](https://stellar.expert/explorer/testnet/contract/CC2RQTAM5OVTXEMRPD4LR22CMKXWQIFFUUWQQVKRFETSKYB6D6UAT2M3)

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:5173
```

### Proof Generation Client

```bash
cd client
cargo run --release  # outputs target/proof.json
```

### Noir Circuits

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup
cd circuits/wallet_age && nargo test
cd ../kyc_attestation && nargo test
cd ../provenance && nargo test
```

### Contract

```bash
rustup target add wasm32-unknown-unknown
cd contracts/zk-origin
cargo build --target wasm32-unknown-unknown --release
```

---

## Contract API

| Function | Auth | Description |
|---|---|---|
| `admin() -> Address` | Public | Contract admin |
| `total() -> u64` | Public | Number of verified proofs |
| `verify_proof(submitter, proof_a, proof_b, proof_c, public_inputs, source_hash, nullifier)` | Sender | Verify Groth16 proof on-chain |
| `set_verification_key(admin, vk_bytes)` | Admin | Upload circuit verification key |
| `register_attestor(admin, addr, name)` | Admin | Register anchor as attestor |
| `is_nullifier_spent(nullifier) -> bool` | Public | Check replay status |
| `pause(admin)` / `unpause(admin)` | Admin | Emergency circuit breaker |

## Proof Format

Groth16 proofs are 256 bytes: `A(64 G1) || B(128 G2) || C(64 G1)`.
Each public input is a 32-byte field element encoded as hex.

## License

MIT
