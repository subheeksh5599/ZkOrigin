fn main(
    wallet_address: [u8; 32],
    wallet_created_at: u64,
    cutoff_timestamp: pub u64,
    nullifier_secret: Field,
) -> pub (Field, Field, bool) {
    assert(wallet_created_at <= cutoff_timestamp);

    let is_mainnet = wallet_address[0] == 0;
    let is_testnet = wallet_address[0] == 48;
    assert(is_mainnet | is_testnet);

    let nullifier = std::hash::pedersen_hash([
        nullifier_secret,
        wallet_address[0] as Field,
        wallet_address[1] as Field,
        0x57414c4c45545f414745 as Field,
    ]);

    let source_hash = std::hash::pedersen_hash([
        wallet_address[0] as Field,
        wallet_address[1] as Field,
        wallet_created_at as Field,
        0x534f555243455f48415348 as Field,
    ]);

    (nullifier, source_hash, true)
}

#[test]
fn test_wallet_age_valid() {
    let wallet = [0x30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let (nullifier, source_hash, verified) = main(wallet, 1704067200, 1735689600, 123456789);
    assert(verified);
    assert(nullifier != 0);
    assert(source_hash != 0);
}

#[test(should_fail)]
fn test_wallet_too_new() {
    let wallet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let _ = main(wallet, 1767225600, 1735689600, 0);
}

#[test]
fn test_different_wallets_different_nullifiers() {
    let wallet1 = [0x30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let wallet2 = [0x30, 0xFF, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let (n1, _, _) = main(wallet1, 1704067200, 1735689600, 42);
    let (n2, _, _) = main(wallet2, 1704067200, 1735689600, 42);
    assert(n1 != n2);
}
