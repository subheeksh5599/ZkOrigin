# zkOrigin

Cryptographic payment provenance on Stellar. Freelancers and gig workers prove their income is clean before their bank account gets frozen. Scammers cannot.

Built for **Stellar Hacks: Real-World ZK**, June 2026.

---

## Problem

When tainted money enters a crypto payment chain, every innocent downstream receiver gets their bank account frozen — guilty until proven innocent, with no cryptographic way to prove otherwise.

## Solution

Three zero-knowledge proofs chained together, verified on-chain via Stellar's BN254 host functions. Each payment carries a recursive provenance proof that anchors, auditors, and regulators can cryptographically verify without seeing the underlying identity data.

---

## Architecture

| Layer | Stack |
|-------|-------|
| ZK Circuits | Noir DSL, compiled to arithmetic circuits |
| Proving System | Groth16 over BN254 curve |
| On-Chain Verifier | Soroban smart contract (Rust, soroban-sdk 26.x) |
| Host Functions | BN254 pairing check, SHA-256 hashing |
| Frontend | React 19 + GSAP + Tailwind v4 |
| Wallet | Freighter, Stellar Wallets Kit |
| Network | Stellar Testnet |

Contract: `CC6VEWZRGUI4TFN4N4ZUTITDTW5A4CTUH6AQR67AOWXLX5XW4WE6AARP`
[View on Explorer](https://stellar.expert/explorer/testnet/contract/CC6VEWZRGUI4TFN4N4ZUTITDTW5A4CTUH6AQR67AOWXLX5XW4WE6AARP)

---

## Project Structure

```
.
├── src/                  # React frontend
│   ├── pages/            # Dashboard, Docs, Landing
│   ├── sections/         # Hero, Message, UseCases, HowItWorks, Benefit, Testimonial, Footer
│   ├── components/       # ClipPathTitle, FlavorSlider/Title, NavBar, VideoPinSection, LandingLayout
│   ├── hooks/            # useContract, useWallet
│   └── constants/        # useCases, pipelineSteps, cards
├── contracts/zk-origin/  # Soroban smart contract
│   └── src/lib.rs        # Contract entry point + all modules
├── circuits/             # Noir ZK circuits
│   ├── wallet_age/       # Prove wallet older than 6 months
│   ├── kyc_attestation/  # Prove KYC attestation from registered anchor
│   └── provenance/       # Chain wallet_age + kyc into full provenance proof
├── scripts/              # deploy.sh, invoke.sh, setup.sh
├── client/               # Proof generation CLI
└── Makefile
```

---

## Quick Start

```bash
npm install
npm run dev          # localhost:5173
```

### Circuits

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup
cd circuits/wallet_age && nargo test
cd ../kyc_attestation && nargo test
cd ../provenance && nargo test
```

### Contract

```bash
rustup target add wasm32v1-none
cd contracts/zk-origin
cargo build --target wasm32v1-none --release
```

---

## Contract API

| Function | Auth | Description |
|----------|------|-------------|
| `admin() -> Address` | Public | Contract admin |
| `total() -> u64` | Public | Number of verified proofs |
| `verify_proof(submitter, source_hash, nullifier) -> VerificationRecord` | Sender | Submit proof, spend nullifier |
| `register_attestor(admin, addr, name)` | Admin | Register anchor as attestor |
| `is_nullifier_spent(nullifier) -> bool` | Public | Check replay status |
| `pause(admin)` / `unpause(admin)` | Admin | Emergency circuit breaker |

## ZK Circuits

| Circuit | Private Inputs | Proves |
|---------|---------------|--------|
| `wallet_age` | Address, creation timestamp, secret | Wallet older than cutoff |
| `kyc_attestation` | Subject hash, attestor key, dates | Attestor signed valid KYC |
| `provenance` | Sender, source hash, chain hash, amount | Payment originated from clean source |

## Deploy

```bash
cd contracts/zk-origin
cargo build --target wasm32v1-none --release

stellar contract deploy \
  --wasm target/wasm32v1-none/release/zk_origin.wasm \
  --source <KEY> --network testnet \
  -- --admin <ADMIN_ADDRESS>
```

## License

MIT
