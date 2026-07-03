import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useContract } from "../hooks/useContract";

function truncate(s, n) {
  if (!s) return "";
  return s.length <= n * 2 + 4 ? s : s.slice(0, n) + "..." + s.slice(-n);
}

const CIRCUITS = [
  { id: "wallet_age", label: "Wallet Age", description: "Prove wallet is older than cutoff" },
  { id: "kyc_attestation", label: "KYC Attestation", description: "Prove KYC from registered attestor" },
  { id: "provenance", label: "Provenance", description: "Chain proofs into payment provenance" },
];

export default function Dashboard() {
  const wallet = useWallet();
  const contract = useContract();
  const [circuit, setCircuit] = useState("wallet_age");
  const [proofJson, setProofJson] = useState("");
  const [sourceHash, setSourceHash] = useState("");
  const [nullifier, setNullifier] = useState("");
  const [proofA, setProofA] = useState("");
  const [proofB, setProofB] = useState("");
  const [proofC, setProofC] = useState("");
  const [vkX, setVkX] = useState("");
  const [txResult, setTxResult] = useState(null);

  useEffect(() => {
    if (wallet.connected) contract.fetchStats();
  }, [wallet.connected]);

  const parseProofJson = (json) => {
    try {
      const p = JSON.parse(json);
      if (p.proof) {
        setProofA(p.proof.proof_a || "");
        setProofB(p.proof.proof_b || "");
        setProofC(p.proof.proof_c || "");
        setVkX(p.proof.vk_x || "");
        setSourceHash(p.proof.source_hash || "");
        setNullifier(p.proof.nullifier_example || "");
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setTxResult(null);

    let data;
    if (proofJson.trim()) {
      try {
        const p = JSON.parse(proofJson);
        data = {
          proof_a: p.proof?.proof_a || "",
          proof_b: p.proof?.proof_b || "",
          proof_c: p.proof?.proof_c || "",
          vk_x: p.proof?.vk_x || "",
          source_hash: sourceHash || p.proof?.source_hash || "0000000000000000000000000000000000000000000000000000000000000000",
          nullifier: nullifier || p.proof?.nullifier_example || "deadbeef00000000000000000000000000000000000000000000000000000000",
        };
      } catch { return; }
    } else {
      data = {
        proof_a: proofA,
        proof_b: proofB,
        proof_c: proofC,
        vk_x: vkX,
        source_hash: sourceHash,
        nullifier: nullifier,
      };
    }

    if (!data.vk_x) {
      setTxResult({ success: false, error: "vk_x required" });
      return;
    }

    setTxResult(await contract.submitProof(data, wallet.address));
  };

  const canSubmit = !contract.loading && wallet.connected && (proofJson.trim() || (proofA.trim() && proofB.trim() && proofC.trim() && nullifier.trim()));

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c0d] text-zinc-300" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#0c0c0d]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-1.5 font-mono font-bold tracking-tight">
            <span className="text-base text-teal-400">zk</span>
            <span className="text-base text-white">Origin</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/[0.06] px-3 py-1 text-[11px] text-zinc-400 tabular-nums">
              Testnet
            </span>
            {wallet.connected ? (
              <div className="flex items-center gap-2 rounded-lg border border-teal-500/10 bg-teal-500/[0.03] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <span className="text-xs font-mono text-teal-400">{truncate(wallet.address, 6)}</span>
                <button onClick={wallet.disconnect} className="ml-1 rounded-md border border-transparent px-2 py-0.5 text-[11px] text-zinc-400 hover:text-zinc-400 hover:border-white/[0.06]">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={wallet.connect} className="rounded-lg bg-teal-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-teal-400 active:bg-teal-600 transition-colors">
                {wallet.freighterInstalled ? "Connect" : "Get Freighter"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white">Proof Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Submit zero-knowledge Groth16 proofs to the zkOrigin contract on Stellar testnet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.03] rounded-xl overflow-hidden mb-8">
          {[
            { label: "Total Proofs", value: contract.totalProofs, detail: "on-chain submissions" },
            { label: "Contract", value: truncate(contract.contractId, 6), detail: contract.networkOk ? "Soroban RPC online" : "Offline" },
            { label: "Verification", value: "Groth16 / BN254", detail: "256-byte proofs" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0c0c0d] px-5 py-4">
              <div className="text-[11px] text-zinc-400 tracking-wide uppercase">{stat.label}</div>
              <div className="mt-1.5 text-xl font-mono font-semibold text-white">{stat.value}</div>
              <div className="mt-0.5 text-[11px] text-zinc-400">{stat.detail}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-5">
              <div className="text-xs font-medium text-zinc-500 mb-3">Circuit</div>
              <div className="grid grid-cols-3 gap-2">
                {CIRCUITS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCircuit(c.id)}
                    className={`text-left rounded-lg border px-3.5 py-3 text-xs transition-colors ${
                      circuit === c.id
                        ? "border-teal-500/30 bg-teal-500/[0.04] text-teal-400"
                        : "border-white/[0.05] bg-transparent text-zinc-500 hover:text-zinc-400 hover:border-white/[0.08]"
                    }`}
                  >
                    <div className="font-semibold">{c.label}</div>
                    <div className="mt-0.5 text-[10px] text-zinc-500">{c.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-medium text-zinc-500">Proof Data</div>
                <button
                  onClick={() => { setProofJson(""); setProofA(""); setProofB(""); setProofC(""); }}
                  className="text-[10px] text-zinc-400 hover:text-zinc-400 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="mb-4 p-3 rounded-lg border border-teal-500/10 bg-teal-500/[0.02]">
                <label className="block text-[11px] text-zinc-500 mb-1.5">
                  Paste proof.json <span className="text-zinc-500">— from client target/proof.json</span>
                </label>
                <textarea
                  value={proofJson}
                  onChange={(e) => { setProofJson(e.target.value); parseProofJson(e.target.value); }}
                  placeholder='{"vk":{...},"proof":{"proof_a":"...","proof_b":"...","proof_c":"...","vk_x":"...","source_hash":"..."}}'
                  rows={4}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[11px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors resize-y"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">Proof A <span className="text-zinc-500">— G1 point, 64 bytes hex</span></label>
                  <input type="text" value={proofA} onChange={(e) => setProofA(e.target.value)}
                    placeholder="eccb22b6068acb4a2a13491cdca3ca90..."
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">Proof B <span className="text-zinc-500">— G2 point, 128 bytes hex</span></label>
                  <input type="text" value={proofB} onChange={(e) => setProofB(e.target.value)}
                    placeholder="92bc33ab72e829f8f63f05aeb12543d5..."
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">Proof C <span className="text-zinc-500">— G1 point, 64 bytes hex</span></label>
                  <input type="text" value={proofC} onChange={(e) => setProofC(e.target.value)}
                    placeholder="067364423a243f4c57cc389762ce2f83..."
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">VK_X <span className="text-zinc-500">— precomputed ic[0]+ic[1]*pub, 64 bytes hex</span></label>
                  <input type="text" value={vkX} onChange={(e) => setVkX(e.target.value)}
                    placeholder="1500000000000000000000000000000000000000000000000000000000000000"
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">Source Hash <span className="text-zinc-500">— hex identifier</span></label>
                  <input type="text" value={sourceHash} onChange={(e) => setSourceHash(e.target.value)}
                    placeholder="1500000000000000000000000000000000000000000000000000000000000000"
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1.5">Nullifier <span className="text-zinc-500">— 32 bytes hex, prevents replay</span></label>
                  <input type="text" value={nullifier} onChange={(e) => setNullifier(e.target.value)}
                    placeholder="deadbeef00000000000000000000000000000000000000000000000000000000"
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[13px] text-white placeholder:text-zinc-500 focus:border-teal-500/30 focus:outline-none transition-colors" />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full rounded-lg bg-teal-500 py-2.5 text-xs font-semibold text-black hover:bg-teal-400 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-teal-500 active:bg-teal-600 transition-colors"
                >
                  {contract.loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing...
                    </span>
                  ) : (
                    "Submit Groth16 Proof"
                  )}
                </button>
              </div>

              {txResult && (
                <div className={`mt-5 rounded-lg border p-4 ${txResult.success ? "border-teal-500/15 bg-teal-500/[0.02]" : "border-red-500/10 bg-red-500/[0.02]"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 text-xs ${txResult.success ? "text-teal-400" : "text-red-400"}`}>
                      {txResult.success ? "Submitted" : "Failed"}
                    </span>
                    <div className="min-w-0 flex-1">
                      {txResult.success ? (
                        <div className="space-y-1.5">
                          <div className="font-mono text-[11px] text-zinc-400 break-all">{txResult.txHash}</div>
                          <a href={`https://stellar.expert/explorer/testnet/tx/${txResult.txHash}`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 transition-colors">
                            Stellar.Expert
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        </div>
                      ) : (
                        <div className="font-mono text-[11px] text-red-400/80 break-all">{txResult.error}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01]">
              <div className="px-5 py-3.5 border-b border-white/[0.04]">
                <span className="text-xs font-medium text-zinc-500">Contract Details</span>
              </div>
              <div className="px-5 py-3">
                <div className="space-y-3">
                  {[
                    { label: "Contract ID", value: truncate(contract.contractId, 6) },
                    { label: "Admin", value: contract.admin ? truncate(contract.admin, 6) : "--" },
                    { label: "Status", value: contract.networkOk ? "Online" : "Offline", color: contract.networkOk ? "text-teal-400" : "text-red-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">{row.label}</span>
                      <span className={`font-mono ${row.color || "text-zinc-400"}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <a href={`https://stellar.expert/explorer/testnet/contract/${contract.contractId}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-[11px] text-teal-400 hover:text-teal-300 transition-colors">
                  Explorer
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01]">
              <div className="px-5 py-3.5 border-b border-white/[0.04]">
                <span className="text-xs font-medium text-zinc-500">Functions</span>
              </div>
              <div className="px-2 py-2">
                <div className="space-y-0.5">
                  {[
                    "admin()",
                    "total()",
                    "verify_proof(submitter, proof, nullifier)",
                    "register_attestor(admin, addr, name)",
                    "is_nullifier_spent(nullifier)",
                    "pause(admin) / unpause(admin)",
                  ].map((fn, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-md px-3 py-1.5 hover:bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 font-mono tabular-nums w-3">{i + 1}</span>
                      <span className="text-[11px] font-mono text-zinc-500">{fn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-5">
              <div className="text-xs font-medium text-zinc-500 mb-3">How it works</div>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Connect your Freighter wallet (Testnet)" },
                  { step: "2", label: "Choose a circuit type above" },
                  { step: "3", label: "Run client: cargo run --release in client/" },
                  { step: "4", label: "Paste proof.json or hex fields below" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <span className="flex-none w-5 h-5 mt-0.5 rounded-full border border-white/[0.06] flex items-center justify-center text-[10px] text-zinc-400 font-mono">{s.step}</span>
                    <span className="text-[11px] text-zinc-400 leading-relaxed">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
