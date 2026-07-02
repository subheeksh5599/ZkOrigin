const useCases = [
  { name: "Freelancer", color: "green", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Anchor", color: "blue", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Regulator", color: "purple", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Remittance", color: "red", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Payroll", color: "white", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Enterprise", color: "black", rotation: "md:rotate-[8deg] rotate-0" },
];

const pipelineSteps = [
  { label: "Wallet Age", amount: ">6 months" },
  { label: "Anchor KYC", amount: "Verified" },
  { label: "ZK Proof", amount: "Groth16" },
  { label: "On-Chain", amount: "BN254" },
  { label: "Finality", amount: "5 sec" },
];

const cards = [
  { rotation: "rotate-z-[-10deg]", name: "Proof Verified", translation: "translate-y-[-5%]" },
  { rotation: "rotate-z-[4deg]", name: "Scammer Rejected" },
  { rotation: "rotate-z-[-4deg]", name: "Anchor Settles", translation: "translate-y-[-5%]" },
  { rotation: "rotate-z-[4deg]", name: "Payment Clean", translation: "translate-y-[5%]" },
  { rotation: "rotate-z-[-10deg]", name: "Cross-Border" },
  { rotation: "rotate-z-[4deg]", name: "Audit Trail", translation: "translate-y-[5%]" },
  { rotation: "rotate-z-[-3deg]", name: "Mobile Wallet", translation: "translate-y-[10%]" },
];

export { useCases, pipelineSteps, cards };
