"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "💀",
    title: "Chaos Monkey",
    desc: "Randomly terminates service instances in production-like environments to verify your system handles unexpected failures gracefully.",
    tag: "Process Killing",
    color: "#ff3c3c",
  },
  {
    icon: "🌐",
    title: "Network Chaos",
    desc: "Inject latency, packet loss, bandwidth throttling, and full network partitions between any pair of services in your cluster.",
    tag: "Network Layer",
    color: "#ff8c42",
  },
  {
    icon: "🔥",
    title: "Resource Exhaustion",
    desc: "Simulate CPU spikes, memory pressure, and disk I/O saturation to test autoscaling and resource limit configurations.",
    tag: "System Resources",
    color: "#f5c842",
  },
  {
    icon: "⚡",
    title: "Circuit Breaker Tester",
    desc: "Trigger cascading failure conditions and validate that circuit breakers open, half-open, and close at the right thresholds.",
    tag: "Resilience Patterns",
    color: "#4cff91",
  },
  {
    icon: "📡",
    title: "Real-Time Observability",
    desc: "Live metrics dashboard streams fault injection events, service health, error rates, and latency percentiles as chaos unfolds.",
    tag: "Monitoring",
    color: "#42b8ff",
  },
  {
    icon: "📋",
    title: "Automated Reports",
    desc: "After every experiment, FaultForge generates a detailed PDF/JSON report with a resilience score and actionable recommendations.",
    tag: "Reporting",
    color: "#c084fc",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative border border-white/5 bg-[#0d0d0f] p-6 hover:border-white/15 transition-all duration-500 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, border-color 0.3s`,
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 0% 0%, ${feature.color}08 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{feature.icon}</span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-sm"
            style={{
              backgroundColor: `${feature.color}20`,
              color: feature.color,
            }}
          >
            {feature.tag}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#f5f5f5] mb-2">{feature.title}</h3>
        <p className="text-sm text-[#666] leading-relaxed">{feature.desc}</p>
      </div>
    </div>
  );
}

export default function FFFeatures() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#ff3c3c] tracking-widest mb-3 uppercase">Features</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#f5f5f5] leading-tight">
            Every fault. Every layer.
          </h2>
          <p className="text-[#666] mt-4 max-w-xl text-base leading-relaxed">
            FaultForge covers the full spectrum of failure modes — from process crashes to network splits — giving you confidence your system can handle anything.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
