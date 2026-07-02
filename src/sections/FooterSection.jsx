const FooterSection = () => {
  return (
    <section className="footer-section">
      <div className="footer-wave" />

      <div className="2xl:h-[110dvh] relative md:pt-[20vh] pt-[10vh]">
        <div className="overflow-hidden z-10">
          <h1 className="general-title text-center text-milk py-5">
            #PROVE YOUR PAYMENTS
          </h1>
        </div>

        <div className="flex-center gap-5 relative z-10 md:mt-20 mt-5">
          <a href="https://github.com/subheeksh5599/ZkOrigin" target="_blank" rel="noopener noreferrer" className="social-btn">
            <span className="text-milk/60 hover:text-milk text-sm font-semibold">GitHub</span>
          </a>
          <a href="https://discord.gg/stellardev" target="_blank" rel="noopener noreferrer" className="social-btn">
            <span className="text-milk/60 hover:text-milk text-sm font-semibold">Discord</span>
          </a>
        </div>

        <div className="mt-40 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between text-milk/50 font-paragraph md:text-lg font-medium">
          <div className="flex items-center md:gap-16 gap-5">
            <div><p className="text-milk">zkOrigin</p></div>
            <div><p>Use Cases</p><p>Freelancers</p><p>Remittance</p></div>
            <div><p>Developers</p><p>GitHub</p><p>Documentation</p></div>
          </div>
          <div className="md:max-w-lg">
            <p>Built with Noir, BN254 host functions, and deployed on Stellar Soroban. Open-source. Verifiable. Trustless.</p>
          </div>
        </div>

        <div className="copyright-box">
          <p>Built for Stellar Hacks: Real-World ZK 2026 zkOrigin</p>
          <div className="flex items-center gap-7">
            <p>Open Source</p>
            <p>MIT License</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
