import { cards } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TestimonialSection = () => {
  useGSAP(() => {
    gsap.set(".testimonials-section", { marginTop: "-140vh" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section .first-title", { xPercent: 70 })
      .to(".testimonials-section .sec-title", { xPercent: 25 }, "<")
      .to(".testimonials-section .third-title", { xPercent: -50 }, "<");

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".vd-card", { yPercent: 150, stagger: 0.2, ease: "power1.inOut" });
  });

  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">See It</h1>
        <h1 className="text-light-brown sec-title">In</h1>
        <h1 className="text-black third-title">Action</h1>
      </div>

      <div className="flex items-center justify-center w-full ps-52 absolute 2xl:bottom-32 bottom-[50vh]">
        {cards.map((card, index) => (
          <div
            key={card.name}
            className={`vd-card md:w-96 w-80 flex-none md:rounded-[2vw] rounded-3xl -ms-44 overflow-hidden 2xl:relative absolute border-[.5vw] border-milk ${card.translation || ""} ${card.rotation}`}
          >
            <div className="size-full bg-[#1a1a1a] col-center p-6 gap-3">
              <div className="text-2xl font-mono font-bold text-teal-400">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="text-white text-center font-bold text-sm">{card.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
