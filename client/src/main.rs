//! zkOrigin Client — Proof Generation and Contract Interaction
//!
//! This CLI tool generates ZK proofs for wallet age, KYC attestations,
//! and payment provenance, then submits them to the zkOrigin Soroban contract.

fn main() {
    println!("zkOrigin Client v0.1.0");
    println!("==========================");
    println!();
    println!("Usage:");
    println!("  cargo run -- prove-wallet-age <WALLET_ADDR_HEX> <CREATED_AT>");
    println!("  cargo run -- prove-kyc <SUBJECT_HASH> <ATTESTOR_PUBKEY> <CREATED_AT>");
    println!("  cargo run -- prove-payment <SENDER> <SOURCE_HASH> <PREV_CHAIN> <AMOUNT>");
    println!();
    println!("Flow:");
    println!("  1. Generate wallet age proof → get source_hash");
    println!("  2. Generate KYC attestation proof → get attestation_hash");
    println!("  3. Generate combined provenance proof → get chain_hash + nullifier");
    println!("  4. Submit to zkOrigin contract via Stellar CLI");
    println!();
    println!("For full contract interaction, use:");
    println!("  stellar contract invoke --id <CONTRACT_ID> \\");
    println!("    --source <KEY> --network testnet \\");
    println!("    -- verify_proof --submitter <ADDR> --proof '{{...}}' --nullifier '0x...'");
}

/// Derive a nullifier from a secret and domain-specific inputs.
/// nullifier = SHA256(secret || domain_separator || ...inputs)
fn derive_nullifier(secret: &[u8], domain: &[u8], inputs: &[&[u8]]) -> Vec<u8> {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(secret);
    hasher.update(domain);
    for input in inputs {
        hasher.update(input);
    }
    hasher.finalize().to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_derive_nullifier() {
        let secret = b"my_secret_key_12345";
        let domain = b"WALLET_AGE";
        let inputs: &[&[u8]] = &[&[0xAA, 0xBB]];
        let nf = derive_nullifier(secret, domain, inputs);
        assert_eq!(nf.len(), 32);
        // Same inputs produce same nullifier
        let nf2 = derive_nullifier(secret, domain, inputs);
        assert_eq!(nf, nf2);
    }
}
