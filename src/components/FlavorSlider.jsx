import { useGSAP } from "@gsap/react";
import { useCases } from "../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const FlavorSlider = () => {
  const sliderRef = useRef();
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

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
        {useCases.map((useCase, i) => (
          <div
            key={useCase.name}
            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${useCase.rotation} overflow-hidden rounded-[2vw] border-[0.5vw] border-milk/20`}
          >
            <div
              className="drinks"
              style={{ background: `linear-gradient(180deg, ${useCase.bg} 0%, ${useCase.bg}cc 100%)` }}
            />
            <div className="absolute inset-0 w-full h-full" style={{
              background: `radial-gradient(ellipse at 80% 20%, ${useCase.bg}44 0%, transparent 60%)`,
            }} />
            <div className="absolute top-6 right-7 md:top-10 md:right-10 text-[10vw] md:text-[7vw] font-bold leading-none opacity-[0.06]" style={{ color: useCase.text }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h1 style={{ color: useCase.text }}>{useCase.name}</h1>
            <div className="absolute bottom-0 left-0 w-full h-1/3" style={{
              background: `linear-gradient(0deg, ${useCase.bg} 0%, transparent 100%)`,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSlider;
