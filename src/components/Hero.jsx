const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Meet Ghosti
        </h1>

        <div className="relative inline-block my-12">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent blur-3xl animate-pulse"></div>
          <img
            src="/base.jpg"
            alt="Base Ghosti"
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain animate-float"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Ghosti is a playful spirit from a forgotten chain, waking up on Solana to inhabit new forms.
          Whether rocking a cape, shades, or headphones, each Ghosti is unique – but they all float with
          the same soul. <span className="text-[#3ddad7]">No utility. No hype. Just Ghosti.</span>
        </p>
      </div>

      <div className="absolute top-20 left-10 w-2 h-2 bg-[#3ddad7] rounded-full animate-twinkle"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-twinkle delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-[#3ddad7] rounded-full animate-twinkle delay-2000"></div>
    </section>
  );
};

export default Hero;
