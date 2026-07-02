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
  { src: "/videos/f1.mp4", rotation: "rotate-z-[-10deg]", name: "Proof Verified", img: "/images/p1.png", translation: "translate-y-[-5%]" },
  { src: "/videos/f2.mp4", rotation: "rotate-z-[4deg]", name: "Scammer Rejected", img: "/images/p2.png" },
  { src: "/videos/f3.mp4", rotation: "rotate-z-[-4deg]", name: "Anchor Settles", img: "/images/p3.png", translation: "translate-y-[-5%]" },
  { src: "/videos/f4.mp4", rotation: "rotate-z-[4deg]", name: "Payment Clean", img: "/images/p4.png", translation: "translate-y-[5%]" },
  { src: "/videos/f5.mp4", rotation: "rotate-z-[-10deg]", name: "Cross-Border", img: "/images/p5.png" },
  { src: "/videos/f6.mp4", rotation: "rotate-z-[4deg]", name: "Audit Trail", img: "/images/p6.png", translation: "translate-y-[5%]" },
  { src: "/videos/f7.mp4", rotation: "rotate-z-[-3deg]", name: "Mobile Wallet", img: "/images/p7.png", translation: "translate-y-[10%]" },
];

export { useCases, pipelineSteps, cards };
