fn main(
    sender_address: [u8; 32],
    source_hash: Field,
    previous_chain_hash: Field,
    payment_amount: u64,
    max_payment: pub u64,
    nullifier_secret: Field,
    payment_counter: pub u64,
) -> pub (Field, Field, bool) {
    assert(source_hash != 0);
    assert(payment_amount > 0);
    assert(payment_amount <= max_payment);

    let is_testnet = sender_address[0] == 48;
    let is_mainnet = sender_address[0] == 0;
    assert(is_testnet | is_mainnet);

    let nullifier = std::hash::pedersen_hash([
        nullifier_secret,
        sender_address[0] as Field,
        sender_address[1] as Field,
        payment_counter as Field,
        source_hash,
        0x50524f56454e414e4345 as Field,
    ]);

    let chain_hash = std::hash::pedersen_hash([
        previous_chain_hash,
        source_hash,
        sender_address[0] as Field,
        sender_address[1] as Field,
        payment_amount as Field,
        nullifier,
        0x434841494e5f48415348 as Field,
    ]);

    (nullifier, chain_hash, true)
}

#[test]
fn test_clean_payment_chain() {
    let sender = [0x30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let (nullifier, chain_hash, is_clean) = main(sender, 0xABCD1234, 0xDEADBEEF, 1000000000, 5000000000, 42, 1);
    assert(is_clean);
    assert(nullifier != 0);
    assert(chain_hash != 0);
}

#[test(should_fail)]
fn test_zero_source_hash_fails() {
    let sender = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let _ = main(sender, 0, 0, 100, 1000, 0, 0);
}

#[test(should_fail)]
fn test_payment_exceeds_max() {
    let sender = [0x30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let _ = main(sender, 0x1234, 0, 2000, 1000, 0, 0);
}

#[test]
fn test_chain_is_recursive() {
    let sender = [0x30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    let source = 0xAA;
    let (n1, c1, _) = main(sender, source, 0, 100, 10000, 42, 1);
    let (n2, c2, _) = main(sender, source, c1, 200, 10000, 42, 2);
    let (n3, c3, _) = main(sender, source, c2, 300, 10000, 42, 3);
    assert(c1 != c2);
    assert(c2 != c3);
    assert(c1 != c3);
    assert(n1 != n2);
    assert(n2 != n3);
}
