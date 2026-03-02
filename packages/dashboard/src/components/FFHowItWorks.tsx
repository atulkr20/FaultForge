"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Define Your Target",
    desc: "Point FaultForge at any running service — Kubernetes pods, Docker containers, or bare-metal processes. No code changes needed.",
    code: `faultforge target add \\
  --name api-gateway \\
  --type kubernetes \\
  --namespace production`,
  },
  {
    number: "02",
    title: "Configure a Scenario",
    desc: "Choose from pre-built chaos recipes or compose custom experiments with fine-grained control over blast radius and duration.",
    code: `scenario:
  type: network-partition
  target: api-gateway
  duration: 90s
  intensity: 30%  # packet loss
  blast_radius: single-replica`,
  },
  {
    number: "03",
    title: "Run the Experiment",
    desc: "FaultForge injects faults in real-time, streams live telemetry, and continuously evaluates your system's health against baseline SLOs.",
    code: `$ faultforge run scenario.yml
> Injecting network partition...
> Monitoring SLO breach: latency p99
> Circuit breaker: OPEN at t=14s
> System recovered at t=52s ✓`,
  },
  {
    number: "04",
    title: "Analyze & Harden",
    desc: "Receive a detailed resilience report with a score, identified weaknesses, and concrete recommendations to harden your system.",
    code: `Resilience Score: 94 / 100
Weaknesses Found: 3
  - auth-service: no retry policy
  - db-pool: exhausted under load
  - cache: cold-start latency spike
Auto-fix applied: 2 / 3`,
  },
];

export default function FFHowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-[#ff3c3c]/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#ff3c3c] tracking-widest mb-3 uppercase">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#f5f5f5] leading-tight">
            Chaos, engineered precisely.
          </h2>
        </div>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-start md:items-center`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Text */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-black font-mono text-[#ff3c3c]/20">{step.number}</span>
          <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f5]">{step.title}</h3>
        </div>
        <p className="text-[#666] leading-relaxed text-base">{step.desc}</p>
      </div>

      {/* Code block */}
      <div className="flex-1 w-full">
        <div className="bg-[#0d0d0f] border border-white/5 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111113] border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <pre className="p-5 text-sm font-mono text-[#888] leading-7 overflow-x-auto">
            <code>{step.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
