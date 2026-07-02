use ark_bn254::{Bn254, Fr, G1Affine, G2Affine};
use ark_crypto_primitives::snark::SNARK;
use ark_groth16::Groth16;
use ark_relations::{lc, r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError}};
use ark_ff::{PrimeField, BigInteger};
use rand::{rngs::StdRng, SeedableRng};
use serde::Serialize;
use std::fs;
use std::ops::Mul;

struct MultiplyCircuit { a: Fr, b: Fr }

impl ConstraintSynthesizer<Fr> for MultiplyCircuit {
    fn generate_constraints(self, cs: ConstraintSystemRef<Fr>) -> Result<(), SynthesisError> {
        let a = cs.new_witness_variable(|| Ok(self.a))?;
        let b = cs.new_witness_variable(|| Ok(self.b))?;
        let c = cs.new_input_variable(|| Ok(self.a * self.b))?;
        cs.enforce_constraint(lc!() + a, lc!() + b, lc!() + c)?;
        Ok(())
    }
}

fn fp_be(fp: &impl PrimeField) -> Vec<u8> { fp.into_bigint().to_bytes_be() }

fn g1_bytes(g1: &G1Affine) -> Vec<u8> {
    let mut v = Vec::with_capacity(64);
    v.extend(&fp_be(&g1.x)); v.extend(&fp_be(&g1.y));
    v[0] &= 0x3F;
    v
}

fn g2_bytes(g2: &G2Affine) -> Vec<u8> {
    let mut v = Vec::with_capacity(128);
    v.extend(&fp_be(&g2.x.c1)); v.extend(&fp_be(&g2.x.c0));
    v.extend(&fp_be(&g2.y.c1)); v.extend(&fp_be(&g2.y.c0));
    v
}

fn fr_bytes(f: &Fr) -> Vec<u8> { f.into_bigint().to_bytes_be() }

#[derive(Serialize)]
struct Output {
    vk_alpha: String, vk_beta: String, vk_gamma: String, vk_delta: String,
    proof_a: String, proof_b: String, proof_c: String,
    vk_x: String, source_hash: String, nullifier: String,
}

fn main() {
    fs::create_dir_all("target").unwrap();
    let rng = &mut StdRng::seed_from_u64(0x7A6B_4F72_6967_696E);
    let a = Fr::from(3u64); let b = Fr::from(7u64); let c = a * b;

    let circuit = MultiplyCircuit { a, b };
    let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit, rng).unwrap();

    let circuit = MultiplyCircuit { a, b };
    let proof = Groth16::<Bn254>::prove(&pk, circuit, rng).unwrap();

    // vk_x = ic[0] + ic[1] * pub_input
    let vk_x_pt = G1Affine::from(vk.gamma_abc_g1[0]) + G1Affine::from(vk.gamma_abc_g1[1]).mul(c);

    let ok = Groth16::<Bn254>::verify(&vk, &[c], &proof).unwrap();
    println!("Local verify: {}", if ok { "PASS" } else { "FAIL" });

    let out = Output {
        vk_alpha: hex::encode(&g1_bytes(&vk.alpha_g1)),
        vk_beta:  hex::encode(&g2_bytes(&vk.beta_g2)),
        vk_gamma: hex::encode(&g2_bytes(&vk.gamma_g2)),
        vk_delta: hex::encode(&g2_bytes(&vk.delta_g2)),
        proof_a: hex::encode(&g1_bytes(&proof.a)),
        proof_b: hex::encode(&g2_bytes(&proof.b)),
        proof_c: hex::encode(&g1_bytes(&proof.c)),
        vk_x:    hex::encode(&g1_bytes(&vk_x_pt.into())),
        source_hash: hex::encode(&fr_bytes(&c)),
        nullifier: "deadbeef00000000000000000000000000000000000000000000000000000000".into(),
    };

    let json = serde_json::to_string_pretty(&out).unwrap();
    fs::write("target/proof.json", &json).unwrap();
    println!("{}", json);
}
