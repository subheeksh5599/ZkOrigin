export default function Docs() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
      <p className="mt-2 text-zinc-500">Contract API reference, circuit specs, and integration guide.</p>

      <div className="mt-10 space-y-16">
        <Section title="Contract API">
          <Endpoint method="verify_proof" auth="Sender" desc="Verify a Groth16 proof on BN254. Spends a nullifier. Emits a payment_verified event." />
          <Endpoint method="register_attestor" auth="Admin" desc="Register a KYC attestor with minimum stake." />
          <Endpoint method="verify_source_attestation" auth="Public" desc="Verify an Ed25519-signed source attestation from a registered attestor." />
          <Endpoint method="record_payment" auth="Sender" desc="Record a verified clean payment with recursive chain hash." />
          <Endpoint method="get_payment_receipt" auth="Public" desc="Query a payment receipt by ID." />
          <Endpoint method="is_nullifier_spent" auth="Public" desc="Check if a nullifier has been used." />
          <Endpoint method="total_proofs" auth="Public" desc="Returns the total number of verified proofs." />
          <Endpoint method="pause / unpause" auth="Admin" desc="Emergency circuit breaker for the contract." />
        </Section>

        <Section title="ZK Circuits">
          <CircuitDoc
            name="wallet_age"
            desc="Proves a Stellar wallet is older than a configurable threshold without revealing the address."
            inputs="wallet_address, wallet_created_at (private), cutoff_timestamp (public), nullifier_secret (private)"
            outputs="nullifier, source_hash, age_verified"
          />
          <CircuitDoc
            name="kyc_attestation"
            desc="Proves a registered attestor signed off on a user's KYC without revealing identity."
            inputs="subject_hash, attestor_pubkey, attestation_type, issued_at, expires_at (private), current_time (public)"
            outputs="nullifier, attestation_hash, is_valid"
          />
          <CircuitDoc
            name="provenance"
            desc="Chains wallet age + KYC proof into one recursive proof of clean payment provenance."
            inputs="sender_address, source_hash, previous_chain_hash, payment_amount (private), max_payment, payment_counter (public)"
            outputs="nullifier, chain_hash, is_clean"
          />
        </Section>

        <Section title="Error Codes">
          <div className="grid gap-3 font-mono text-sm">
            {[
              [1, "NotAdmin", "Caller is not the contract admin"],
              [3, "ProofVerificationFailed", "BN254 pairing check failed"],
              [4, "NullifierAlreadySpent", "This nullifier was already consumed"],
              [5, "AttestorNotRegistered", "Attestor not found in registry"],
              [10, "AttestorInactive", "Attestor has been deactivated"],
              [11, "AttestationExpired", "Attestation validity period has ended"],
              [12, "InvalidAttestationSignature", "Ed25519 signature verification failed"],
              [15, "ChainProofInvalid", "Recursive chain hash mismatch"],
            ].map(([code, name, desc]) => (
              <div key={code} className="flex gap-4 rounded-lg border border-white/[0.06] bg-white/[0.01] px-4 py-3">
                <span className="text-teal-400 shrink-0 w-6">{code}</span>
                <div>
                  <span className="font-bold text-white">{name}</span>
                  <span className="ml-3 text-zinc-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Integration Guide">
          <div className="space-y-6 text-zinc-400 leading-relaxed">
            <p><strong className="text-white">1. Generate proofs</strong> — Run Noir circuits via <code className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-sm text-teal-400">nargo execute</code>. Each circuit produces a Groth16 proof artifact.</p>
            <p><strong className="text-white">2. Deploy contract</strong> — <code className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-sm text-teal-400">stellar contract deploy --wasm zk_origin.wasm --network testnet</code></p>
            <p><strong className="text-white">3. Register attestors</strong> — Call <code className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-sm text-teal-400">register_attestor</code> for each KYC provider.</p>
            <p><strong className="text-white">4. Submit proofs</strong> — Users submit proofs via the dashboard. The contract verifies using BN254 pairing check.</p>
            <p><strong className="text-white">5. Anchors consume events</strong> — Listen for <code className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-sm text-teal-400">payment_verified</code> events to release fiat.</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Endpoint({ method, auth, desc }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/[0.04] py-4">
      <code className="shrink-0 rounded bg-white/[0.06] px-3 py-1 font-mono text-sm text-teal-400">{method}</code>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium mt-0.5 ${auth === "Admin" ? "bg-purple-500/10 text-purple-400" : auth === "Sender" ? "bg-amber-500/10 text-amber-400" : "bg-zinc-500/10 text-zinc-400"}`}>{auth}</span>
      <span className="text-sm text-zinc-400">{desc}</span>
    </div>
  );
}

function CircuitDoc({ name, desc, inputs, outputs }) {
  return (
    <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
      <h3 className="font-mono text-lg font-bold text-teal-400">{name}</h3>
      <p className="mt-2 text-zinc-400">{desc}</p>
      <div className="mt-4 grid gap-2 font-mono text-xs">
        <div><span className="text-zinc-500">Inputs: </span><span className="text-zinc-300">{inputs}</span></div>
        <div><span className="text-zinc-500">Outputs: </span><span className="text-zinc-300">{outputs}</span></div>
      </div>
    </div>
  );
}
