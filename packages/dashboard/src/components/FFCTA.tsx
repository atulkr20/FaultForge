export default function FFCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,60,60,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,60,60,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-transparent to-[#060608]" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#ff3c3c]/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xs font-mono text-[#ff3c3c] tracking-widest mb-4 uppercase">Ready to break things?</p>
        <h2 className="text-4xl md:text-6xl font-extrabold text-[#f5f5f5] leading-tight mb-6">
          Forge resilience.
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #ff3c3c, #ff8c42)" }}
          >
            Ship with confidence.
          </span>
        </h2>
        <p className="text-[#666] text-lg leading-relaxed max-w-xl mx-auto mb-10">
          FaultForge gives backend engineers the tools to proactively test and harden their systems — before chaos finds them first.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/signup"
            className="px-8 py-3.5 bg-[#ff3c3c] hover:bg-[#ff5555] text-white text-sm font-semibold font-mono transition-all duration-200 shadow-[0_0_40px_rgba(255,60,60,0.35)] hover:shadow-[0_0_60px_rgba(255,60,60,0.5)]"
          >
            Get Started →
          </a>
          <a
            href="/signin"
            className="px-8 py-3.5 border border-white/10 text-[#888] hover:text-[#f5f5f5] hover:border-white/30 text-sm font-mono transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-white/5 pt-8 pb-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <span className="font-mono font-bold text-[#ff3c3c] text-sm">⚡ FaultForge</span>
          <p className="text-xs text-[#444] font-mono">
            A chaos engineering platform by Atul — inspired by Netflix Chaos Monkey.
          </p>
          <p className="text-xs text-[#444] font-mono">
            Built with Node.js · Redis · Kafka · Docker
          </p>
        </div>
      </footer>
    </section>
  );
}
