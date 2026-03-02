"use client";

import { useEffect, useRef, useState } from "react";

const techStack = [
  {
    category: "Runtime",
    items: [
      { name: "Node.js", desc: "Event-driven fault orchestration engine" },
      { name: "Express", desc: "REST API for scenario configuration" },
    ],
    color: "#4cff91",
  },
  {
    category: "Messaging",
    items: [
      { name: "Apache Kafka", desc: "Streams fault events and telemetry data" },
      { name: "Redis Pub/Sub", desc: "Real-time experiment status updates" },
    ],
    color: "#f5c842",
  },
  {
    category: "Infrastructure",
    items: [
      { name: "Docker", desc: "Container-level fault injection and kill" },
      { name: "MongoDB", desc: "Stores experiment history and reports" },
    ],
    color: "#42b8ff",
  },
  {
    category: "Observability",
    items: [
      { name: "WebSockets", desc: "Live metric streaming to dashboard" },
      { name: "Prometheus-compatible", desc: "Metric scraping and alerting" },
    ],
    color: "#c084fc",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function FFStack() {
  return (
    <section id="stack" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {[
            { val: 12, suffix: "+", label: "Fault Types" },
            { val: 94, suffix: "%", label: "Avg Resilience Score" },
            { val: 3, suffix: "ms", label: "Injection Latency" },
            { val: 100, suffix: "%", label: "Containerized" },
          ].map(({ val, suffix, label }) => (
            <div
              key={label}
              className="bg-[#0d0d0f] border border-white/5 p-6 text-center hover:border-[#ff3c3c]/20 transition-colors duration-300"
            >
              <div className="text-4xl font-black font-mono text-[#ff3c3c] mb-2">
                <AnimatedCounter target={val} suffix={suffix} />
              </div>
              <div className="text-xs font-mono text-[#555] uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Stack grid */}
        <div className="mb-12">
          <p className="text-xs font-mono text-[#ff3c3c] tracking-widest mb-3 uppercase">Tech Stack</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#f5f5f5] leading-tight">
            Production-grade foundations.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((group) => (
            <div
              key={group.category}
              className="bg-[#0d0d0f] border border-white/5 p-6 hover:border-white/10 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color }}
                />
                <span
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: group.color }}
                >
                  {group.category}
                </span>
              </div>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <span className="font-mono font-bold text-[#f5f5f5] text-sm min-w-[130px]">
                      {item.name}
                    </span>
                    <span className="text-sm text-[#555] leading-relaxed">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
