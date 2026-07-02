import { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { useContract } from "../hooks/useContract";

function truncate(s, n) {
  if (!s) return "";
  return s.length <= n * 2 + 4 ? s : s.slice(0, n) + "..." + s.slice(-n);
}

export default function Dashboard() {
  const wallet = useWallet();
  const contract = useContract();
  const [sourceHash, setSourceHash] = useState("");
  const [nullifier, setNullifier] = useState("");
  const [txResult, setTxResult] = useState(null);

  useEffect(() => { if (wallet.connected) contract.fetchStats(); }, [wallet.connected]);

  const handleSubmit = async () => {
    setTxResult(null);
    setTxResult(await contract.submitProof(sourceHash, nullifier, wallet.address));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-zinc-500 text-sm">Submit and verify payment provenance proofs on Stellar testnet</p>
          </div>
          {wallet.connected ? (
            <div className="flex items-center gap-3 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <span className="font-mono text-sm text-teal-400">{truncate(wallet.address, 6)}</span>
              <button onClick={wallet.disconnect} className="ml-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-zinc-500 hover:text-white hover:border-white/30 transition-colors">Disconnect</button>
            </div>
          ) : (
            <button onClick={wallet.connect} className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-teal-400 text-sm">
              {wallet.freighterInstalled ? "Connect Freighter" : "Install Freighter"}
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8">
              <h2 className="text-lg font-semibold">Submit Proof</h2>
              <p className="mt-1 text-sm text-zinc-500">Calls verify_proof on the deployed zkOrigin contract. Freighter will prompt for signing.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400">Source Hash (bytes, e.g. "abcd1234")</label>
                  <input type="text" value={sourceHash} onChange={(e) => setSourceHash(e.target.value)} placeholder="abcd1234..." className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400">Nullifier (32 bytes hex, e.g. "deadbeef0000...")</label>
                  <input type="text" value={nullifier} onChange={(e) => setNullifier(e.target.value)} placeholder="deadbeef00000000000000000000000000000000000000000000000000000000" className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:outline-none" />
                </div>
                <button onClick={handleSubmit} disabled={contract.loading || !wallet.connected || !sourceHash || !nullifier} className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-black transition-colors hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed">
                  {contract.loading ? "Signing and verifying..." : "Submit Proof to Contract"}
                </button>
              </div>
              {txResult && (
                <div className={`mt-6 rounded-lg border p-4 font-mono text-xs ${txResult.success ? "border-teal-500/20 bg-teal-500/[0.04] text-teal-400" : "border-red-500/20 bg-red-500/[0.04] text-red-400"}`}>
                  {txResult.success ? <><div className="font-bold mb-1">Transaction Submitted</div><div className="break-all">Hash: {txResult.txHash}</div><a href={`https://stellar.expert/explorer/testnet/tx/${txResult.txHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white mt-2 inline-block">View on Explorer</a></> : <div className="font-bold">Error: {txResult.error}</div>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
              <h3 className="font-semibold">Contract</h3>
              <div className="mt-4 space-y-3">
                {[{ label: "Total Proofs", value: contract.totalProofs }, { label: "Network", value: "Testnet" }, { label: "Contract", value: truncate(contract.contractId, 6) }, { label: "Status", value: contract.networkOk ? "Online" : "Offline" }].map(s => (
                  <div key={s.label} className="flex justify-between text-sm"><span className="text-zinc-500">{s.label}</span><span className={`font-mono ${s.value === "Online" ? "text-teal-400" : "text-zinc-300"}`}>{s.value}</span></div>
                ))}
              </div>
              <a href={`https://stellar.expert/explorer/testnet/contract/${contract.contractId}`} target="_blank" rel="noopener noreferrer" className="block mt-4 text-xs text-teal-400 hover:text-teal-300 transition-colors">View on Stellar.Expert</a>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6">
              <h3 className="font-semibold">Contract Functions</h3>
              <div className="mt-4 space-y-1.5 font-mono text-xs text-zinc-400">
                {["admin()", "total()", "verify_proof(submitter, source_hash, nullifier)", "register_attestor(admin, addr, name)", "is_nullifier_spent(nullifier)", "pause(admin) / unpause(admin)"].map(fn => <div key={fn} className="rounded bg-white/[0.04] px-3 py-1.5">{fn}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
