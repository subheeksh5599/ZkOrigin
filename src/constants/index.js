const useCases = [
  { name: "Freelancer", bg: "#94714A", text: "#F5E6D3", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Anchor",     bg: "#2E4057", text: "#C8D6E5", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Regulator",  bg: "#5C2E2E", text: "#E8D5D5", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Remittance", bg: "#3D5C3A", text: "#D4E8D0", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Payroll",    bg: "#4A5568", text: "#E2E8F0", rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Enterprise", bg: "#1A1A1A", text: "#A0A0A0", rotation: "md:rotate-[8deg] rotate-0" },
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
