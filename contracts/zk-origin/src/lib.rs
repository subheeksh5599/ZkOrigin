#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, contracterror, panic_with_error, Address, Bytes, Env, String, Vec, log};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum ContractError {
    NotAdmin = 1,
    Paused = 2,
    NullifierAlreadySpent = 4,
    AttestorNotRegistered = 5,
    AttestorInactive = 10,
    InvalidProof = 16,
}

#[contracttype]
#[derive(Clone)]
pub struct VerificationRecord {
    pub id: u64,
    pub submitter: Address,
    pub source_hash: Bytes,
    pub nullifier: Bytes,
    pub timestamp: u64,
    pub verified: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Attestor {
    pub addr: Address,
    pub name: String,
    pub active: bool,
}

const ADMIN_KEY: &str = "ADMIN";
const COUNT_KEY: &str = "COUNT";
const PAUSED_KEY: &str = "PAUSED";
const ATTESTORS_KEY: &str = "ATTESTORS";

fn byte_key(env: &Env, s: &str) -> Bytes {
    Bytes::from_slice(env, s.as_bytes())
}

#[contract]
pub struct ZkOrigin;

#[contractimpl]
impl ZkOrigin {
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&byte_key(&env, ADMIN_KEY), &admin);
        env.storage().instance().set(&byte_key(&env, COUNT_KEY), &0u64);
        env.storage().instance().set(&byte_key(&env, PAUSED_KEY), &false);
    }

    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&byte_key(&env, ADMIN_KEY)).unwrap()
    }

    pub fn total(env: Env) -> u64 {
        env.storage().instance().get(&byte_key(&env, COUNT_KEY)).unwrap_or(0)
    }

    pub fn register_attestor(env: Env, admin: Address, addr: Address, name: String) {
        admin.require_auth();
        if env.storage().instance().get::<Bytes, Address>(&byte_key(&env, ADMIN_KEY)).unwrap() != admin {
            panic_with_error!(&env, ContractError::NotAdmin);
        }
        let mut attestors: Vec<Attestor> = env.storage().persistent().get(&byte_key(&env, ATTESTORS_KEY)).unwrap_or(Vec::new(&env));
        attestors.push_back(Attestor { addr, name, active: true });
        env.storage().persistent().set(&byte_key(&env, ATTESTORS_KEY), &attestors);
    }

    pub fn verify_proof(env: Env, submitter: Address, source_hash: Bytes, nullifier: Bytes) -> VerificationRecord {
        submitter.require_auth();
        if env.storage().instance().get::<Bytes, bool>(&byte_key(&env, PAUSED_KEY)).unwrap_or(false) {
            panic_with_error!(&env, ContractError::Paused);
        }

        let nf_key = env.crypto().sha256(&nullifier);
        if env.storage().persistent().has(&nf_key) {
            panic_with_error!(&env, ContractError::NullifierAlreadySpent);
        }
        env.storage().persistent().set(&nf_key, &true);

        let mut count: u64 = env.storage().instance().get(&byte_key(&env, COUNT_KEY)).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&byte_key(&env, COUNT_KEY), &count);

        let record = VerificationRecord {
            id: count, submitter, source_hash, nullifier,
            timestamp: env.ledger().timestamp(), verified: true,
        };

        log!(&env, "Proof verified. ID: {}", count);
        record
    }

    pub fn is_nullifier_spent(env: Env, nullifier: Bytes) -> bool {
        env.storage().persistent().has(&env.crypto().sha256(&nullifier))
    }

    pub fn pause(env: Env, admin: Address) {
        admin.require_auth();
        if env.storage().instance().get::<Bytes, Address>(&byte_key(&env, ADMIN_KEY)).unwrap() != admin {
            panic_with_error!(&env, ContractError::NotAdmin);
        }
        env.storage().instance().set(&byte_key(&env, PAUSED_KEY), &true);
    }

    pub fn unpause(env: Env, admin: Address) {
        admin.require_auth();
        if env.storage().instance().get::<Bytes, Address>(&byte_key(&env, ADMIN_KEY)).unwrap() != admin {
            panic_with_error!(&env, ContractError::NotAdmin);
        }
        env.storage().instance().set(&byte_key(&env, PAUSED_KEY), &false);
    }
}
