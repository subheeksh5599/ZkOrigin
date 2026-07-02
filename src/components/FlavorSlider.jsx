import { useGSAP } from "@gsap/react";
import { useCases } from "../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const FlavorSlider = () => {
  const sliderRef = useRef();

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  const colors = {
    green:  { bg: "#0d3328", accent: "#00d4aa" },
    blue:   { bg: "#0f1f33", accent: "#4d9de0" },
    purple: { bg: "#1a1533", accent: "#6c5ce7" },
    red:    { bg: "#330d11", accent: "#ff4757" },
    white:  { bg: "#1a1a1a", accent: "#e0e0e0" },
    black:  { bg: "#0a0a0a", accent: "#333333" },
  };

  useGSAP(() => {
    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;
    if (!isTablet) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1500}px`,
          scrub: true,
          pin: true,
        },
      });
      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1500}px`,
        ease: "power1.inOut",
      });
    }
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
      },
    });
    titleTl
      .to(".first-text-split", { xPercent: -30, ease: "power1.inOut" })
      .to(".flavor-text-scroll", { xPercent: -22, ease: "power1.inOut" }, "<")
      .to(".second-text-split", { xPercent: -10, ease: "power1.inOut" }, "<");
  });

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {useCases.map((useCase) => {
          const c = colors[useCase.color] || colors.green;
          return (
            <div
              key={useCase.name}
              className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${useCase.rotation}`}
            >
              <div
                className="drinks rounded-3xl"
                style={{ background: `linear-gradient(180deg, ${c.accent}dd 0%, ${c.accent}22 100%)` }}
              />
              <h1 style={{ color: c.accent }}>{useCase.name}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorSlider;
