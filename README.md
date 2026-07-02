# zkOrigin — Verifiable Payment Provenance on Stellar

**Prove your payments are clean with zero-knowledge proofs.**

Built for **Stellar Hacks: Real-World ZK** (June 2026).

---

## Project Structure

```
zkorigin/
├── src/                          # React + Vite + GSAP Frontend
│   ├── App.jsx                   # Main app layout
│   ├── index.css                 # Tailwind CSS + theme
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── ClipPathTitle.jsx
│   │   ├── FlavorSlider.jsx
│   │   ├── FlavorTitle.jsx
│   │   └── VideoPinSection.jsx
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── MessageSection.jsx
│   │   ├── FlavorSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── BenefitSection.jsx
│   │   ├── TestimonialSection.jsx
│   │   └── FooterSection.jsx
│   └── constants/index.js
├── public/                       # Static assets (images, fonts)
├── contracts/zk-origin/          # Soroban Smart Contract
│   └── src/
│       ├── lib.rs                # Entry point + admin
│       ├── verifier.rs           # Groth16 verification on BN254
│       ├── attestors.rs          # Attestor registry
│       ├── payments.rs           # Payment recording + provenance chain
│       ├── nullifiers.rs         # Anti-replay nullifier tracking
│       ├── types.rs              # Data types
│       ├── errors.rs             # Error codes
│       └── test.rs               # Contract tests
├── circuits/                     # Noir ZK Circuits
│   ├── wallet_age/main.nr        # Wallet age proof
│   ├── kyc_attestation/main.nr   # KYC attestation proof
│   └── provenance/main.nr        # Payment provenance chain
├── client/                       # Proof generation CLI
├── scripts/                      # Deploy, invoke, setup
├── Makefile
└── README.md
```

## Quick Start

### Prerequisites
```bash
# Frontend
npm install

# Backend (Rust + Stellar CLI)
rustup target add wasm32-unknown-unknown
cargo install stellar-cli --features opt

# Noir circuits
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup --version 0.36.0
```

### Frontend
```bash
npm run dev        # Dev server at localhost:5173
npm run build      # Production build
```

### Backend
```bash
make test          # Run contract tests
make circuits      # Compile Noir circuits
make circuit-tests # Run circuit tests
make build         # Build Soroban contract WASM
```

## Contract API

| Function | Description | Auth |
|----------|-------------|------|
| `verify_proof(submitter, proof, nullifier)` | Verify Groth16 proof + spend nullifier | sender |
| `register_attestor(admin, addr, name)` | Register a new KYC attestor | admin |
| `verify_source_attestation(attestation)` | Verify Ed25519-signed source attestation | public |
| `record_payment(sender, receiver, amount, ...)` | Record a clean payment | sender |
| `get_payment_receipt(id)` | Query a payment receipt | public |
| `get_attestor(addr)` | Get attestor details | public |
| `is_nullifier_spent(nullifier)` | Check nullifier status | public |
| `total_proofs()` | Get proof count | public |

## ZK Circuits

| Circuit | Private Inputs | What It Proves |
|---------|---------------|----------------|
| `wallet_age` | wallet addr, creation time, nullifier secret | Wallet ≥ 6 months old |
| `kyc_attestation` | subject hash, attestor pubkey, dates | Attestor signed valid KYC |
| `provenance` | sender, source hash, chain hash, amount | Full chain of clean payments |

## Deploy

```bash
# Build contract
make build

# Deploy to testnet
stellar contract deploy \
  --wasm contracts/zk-origin/target/wasm32-unknown-unknown/release/zk_origin.wasm \
  --source <YOUR_KEY> \
  --network testnet
```

## License

MIT — Built for Stellar Hacks: Real-World ZK 2026
