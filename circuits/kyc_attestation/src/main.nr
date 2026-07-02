fn main(
    subject_hash: Field,
    attestor_pubkey: [u8; 32],
    attestation_type: Field,
    issued_at: u64,
    expires_at: u64,
    current_time: pub u64,
    nullifier_secret: Field,
) -> pub (Field, Field, bool) {
    assert(current_time <= expires_at);
    assert(issued_at <= current_time);
    assert(issued_at < expires_at);

    let is_kyc = attestation_type == 0x4B5943;
    let is_ent = attestation_type == 0x454E54;
    let is_fre = attestation_type == 0x465245;
    assert(is_kyc | is_ent | is_fre);

    let nullifier = std::hash::pedersen_hash([
        nullifier_secret,
        subject_hash,
        attestor_pubkey[0] as Field,
        attestation_type,
        0x4B59435f50524f4f46 as Field,
    ]);

    let attestation_hash = std::hash::pedersen_hash([
        subject_hash,
        attestor_pubkey[0] as Field,
        attestor_pubkey[1] as Field,
        attestation_type,
        issued_at as Field,
        expires_at as Field,
        0x4154544553544154494f4e as Field,
    ]);

    (nullifier, attestation_hash, true)
}

#[test]
fn test_valid_kyc_attestation() {
    let pk = [0xAA, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xBB];
    let (nullifier, hash, valid) = main(
        0x1234567890, pk, 0x4B5943,
        1704067200, 1798761600, 1735689600, 42,
    );
    assert(valid);
    assert(nullifier != 0);
    assert(hash != 0);
}

#[test(should_fail)]
fn test_expired_attestation_fails() {
    let pk = [0xAA, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xBB];
    let _ = main(0x1234567890, pk, 0x4B5943, 1704067200, 1750000000, 1800000000, 0);
}
