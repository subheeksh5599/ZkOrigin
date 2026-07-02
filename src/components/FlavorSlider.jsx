import { useGSAP } from "@gsap/react";
import { useCases } from "../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const FlavorSlider = () => {
  const sliderRef = useRef();
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const cards = [
    { bg: "#7f3b2d", text: "#faeade" },
    { bg: "#a26833", text: "#faeade" },
    { bg: "#523122", text: "#e3a458" },
    { bg: "#a02128", text: "#faeade" },
    { bg: "#e3d3bc", text: "#523122" },
    { bg: "#222123", text: "#e3a458" },
  ];

  useGSAP(() => {
    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
    if (!isTablet) {
      gsap.timeline({
        scrollTrigger: { trigger: ".flavor-section", start: "2% top", end: `+=${scrollAmount + 1500}px`, scrub: true, pin: true },
      }).to(".flavor-section", { x: `-${scrollAmount + 1500}px`, ease: "power1.inOut" });
    }
  });

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {useCases.map((useCase, i) => {
          const c = cards[i % cards.length];
          return (
            <div key={useCase.name} className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${useCase.rotation}`}>
              <div className="drinks" style={{ background: `linear-gradient(180deg, ${c.bg} 0%, ${c.bg}88 100%)` }} />
              <h1 style={{ color: c.text }}>{useCase.name}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorSlider;
