import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,#0d3328_0%,#0a0e17_60%,#060912_100%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.06] px-4 py-1.5 font-mono text-xs text-teal-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            Built on Stellar BN254
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            <span className="text-white">Prove Your Money</span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Is Clean</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Cryptographic proof of payment provenance on Stellar.
            Zero-knowledge verification using Groth16 proofs and BN254 host functions.
            Never get your bank account frozen because of someone else's crime.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/dashboard" className="rounded-xl bg-teal-500 px-8 py-3.5 font-semibold text-black transition-colors hover:bg-teal-400">
              Launch Dashboard
            </Link>
            <Link to="/docs" className="rounded-xl border border-white/10 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/[0.06]">
              Read Docs
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            {[
              { value: "3", label: "Noir ZK Circuits" },
              { value: "BN254", label: "Curve Host Functions" },
              { value: "5s", label: "Stellar Finality" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-3xl font-bold text-teal-400">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-gradient-to-b from-[#060912] to-black py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500">Three layers of cryptographic trust. No mock data. All on-chain.</p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Wallet Age Proof", desc: "Prove your Stellar wallet is older than 6 months using a Noir ZK circuit. Scammers burn wallets. You don't." },
              { step: "02", title: "Anchor KYC Attestation", desc: "A regulated Stellar anchor cryptographically signs your identity. The proof reveals nothing else." },
              { step: "03", title: "Groth16 Verification", desc: "The Soroban contract verifies your combined proof using BN254 pairing checks. 5-second finality." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]">
                <div className="font-mono text-sm font-bold text-teal-500">{item.step}</div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 3L8 9L5 9L10 17L10 11L13 11L8 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-zinc-400">Wallet Age</span>
                </div>
                <span className="text-zinc-600">&rarr;</span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/></svg>
                  </div>
                  <span className="text-zinc-400">KYC Attestation</span>
                </div>
                <span className="text-zinc-600">&rarr;</span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="font-bold text-white">Payment Clean</span>
                </div>
              </div>
              <Link to="/dashboard" className="rounded-lg bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.10]">
                Try It
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { title: "No Mock Data", desc: "Every attestation comes from on-chain data. Wallet age from Stellar ledger. KYC from registered anchors. All verifiable." },
              { title: "Stellar Native", desc: "Uses BN254 host functions added in Protocol 25/26. Single pairing check per batch. 5-second settlement." },
              { title: "Proves Innocence", desc: "When your bank freezes your account, walk in with cryptographic proof. Not screenshots. Not promises. Math." },
              { title: "Anchor Compatible", desc: "Works with existing Stellar anchors via SEP-24. Anchors consume payment events. No infrastructure changes needed." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8">
                <h3 className="font-semibold text-teal-400">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2 font-mono text-sm font-bold">
            <span className="text-teal-400">zk</span>
            <span className="text-white">Origin</span>
            <span className="ml-3 text-zinc-600">| Stellar Hacks 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="https://github.com/subheeksh5599/ZkOrigin" className="transition-colors hover:text-white">GitHub</a>
            <a href="https://discord.gg/stellardev" className="transition-colors hover:text-white">Discord</a>
            <Link to="/docs" className="transition-colors hover:text-white">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
