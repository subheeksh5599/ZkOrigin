import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

const VideoPinSection = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useGSAP(() => {
    if (!isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vd-pin-section",
          start: "-15% top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        },
      });
      tl.to(".video-box", {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power1.inOut",
      });
    }
  });

  return (
    <section className="vd-pin-section">
      <div
        style={{ clipPath: isMobile ? "circle(100% at 50% 50%)" : "circle(6% at 50% 50%)" }}
        className="size-full video-box"
      >
        <div className="size-full col-center gap-6">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 8 L32 14 C32 16 30 17 26 17 L26 26 C26 28 28 30 32 30 C36 30 38 28 38 26 L38 17 C34 17 32 16 32 14Z" stroke="#00d4aa" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <rect x="22" y="16" width="20" height="22" rx="4" stroke="#00d4aa" strokeWidth="2" fill="#00d4aa" fillOpacity="0.08"/>
            <path d="M32 26 L32 30" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="32" cy="33" r="2" fill="#00d4aa"/>
          </svg>
          <p className="text-teal-400 font-mono text-sm tracking-widest">GROTH16 VERIFIED</p>
          <p className="text-zinc-500 font-paragraph text-xs max-w-xs text-center">BN254 pairing check. 5-second finality. Stellar protocol-level verification.</p>
        </div>
      </div>
    </section>
  );
};

export default VideoPinSection;
