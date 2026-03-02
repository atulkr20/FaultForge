"use client";

import { useEffect, useRef } from "react";
import FFTerminal from "@/components/FFTerminal";

export default function FFHero() {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;
    let angle = 0;
    const animate = () => {
      angle = (angle + 0.5) % 360;
      el.style.setProperty("--angle", `${angle}deg`);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,60,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,60,60,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#ff3c3c]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center gap-8">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono text-[#ff3c3c] border border-[#ff3c3c]/30 bg-[#ff3c3c]/5 rounded-full"
          style={{
            background:
              "conic-gradient(from var(--angle, 0deg), transparent 60%, rgba(255,60,60,0.15) 80%, transparent 100%)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3c3c] animate-pulse" />
          Inspired by Netflix Chaos Monkey
        </div>

        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#f5f5f5]">
            Break Things.
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #ff3c3c 0%, #ff8c42 50%, #ff3c3c 100%)",
              }}
            >
              Build Resilience.
            </span>
          </h1>
        </div>

        <p className="max-w-2xl text-lg md:text-xl text-[#888] leading-relaxed">
          FaultForge is a{" "}
          <span className="text-[#f5f5f5] font-medium">production-grade chaos engineering platform</span>{" "}
          that deliberately injects faults into distributed systems, uncovering weaknesses before your users do.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a
            href="/signup"
            className="px-7 py-3 bg-[#ff3c3c] hover:bg-[#ff5555] text-white text-sm font-semibold font-mono transition-all duration-200 shadow-[0_0_30px_rgba(255,60,60,0.3)] hover:shadow-[0_0_40px_rgba(255,60,60,0.5)]"
          >
            Get Started -&gt;
          </a>
          <a
            href="/signin"
            className="px-7 py-3 border border-white/10 text-[#888] hover:text-[#f5f5f5] hover:border-white/30 text-sm font-mono transition-all duration-200"
          >
            Sign In
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mt-4 border-t border-white/5 pt-8 w-full">
          {[
            { val: "12+", label: "Fault Scenarios" },
            { val: "94%", label: "Resilience Score" },
            { val: "< 1s", label: "Injection Latency" },
            { val: "Docker", label: "Native Support" },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-[#ff3c3c]">{val}</div>
              <div className="text-xs text-[#555] mt-1 font-mono uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        <div className="w-full mt-6">
          <FFTerminal />
        </div>
      </div>
    </section>
  );
}
