"use client";

import { useEffect, useState, useRef } from "react";

const lines = [
  { delay: 0,    text: "$ faultforge init --target production-cluster", color: "#f5f5f5" },
  { delay: 600,  text: "> Connecting to cluster: prod-k8s-us-east-1...", color: "#888" },
  { delay: 1000, text: "> Auth verified. 12 services detected.", color: "#888" },
  { delay: 1500, text: "> Loading chaos scenario: network-partition", color: "#888" },
  { delay: 2100, text: "$ faultforge run --scenario network-partition --duration 60s", color: "#f5f5f5" },
  { delay: 2700, text: "> [00:01] Injecting 200ms latency on: api-gateway → auth-service", color: "#f5c842" },
  { delay: 3200, text: "> [00:08] Dropping 15% packets on: order-service → db-primary", color: "#f5c842" },
  { delay: 3700, text: "> [00:14] ALERT: auth-service circuit breaker OPEN (3 retries exceeded)", color: "#ff3c3c" },
  { delay: 4200, text: "> [00:22] Chaos monkey killed: replica-2/payment-service", color: "#ff3c3c" },
  { delay: 4700, text: "> [00:31] System recovering... fallback cache activated", color: "#4cff91" },
  { delay: 5200, text: "> [00:45] Services stabilized. Resilience score: 94/100", color: "#4cff91" },
  { delay: 5800, text: "> [01:00] Experiment complete. Writing report → ./results/", color: "#888" },
  { delay: 6300, text: "$ faultforge report --open", color: "#f5f5f5" },
  { delay: 6800, text: "> Report generated: 3 weaknesses found, 2 resolved automatically.", color: "#4cff91" },
  { delay: 7200, text: "_", color: "#ff3c3c", cursor: true },
];

export default function FFTerminal() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    lines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, line.delay);
    });
  }, [started]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2 bg-[#1a1a1f] px-4 py-3 rounded-t-lg border border-[#2a2a30] border-b-0">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 text-xs font-mono text-[#555]">faultforge — bash — 120×36</span>
      </div>
      <div
        ref={containerRef}
        className="bg-[#0d0d0f] border border-[#2a2a30] border-t-0 rounded-b-lg p-5 h-72 overflow-y-auto font-mono text-sm leading-6"
        style={{ scrollbarColor: "#333 transparent" }}
      >
        {lines.map((line, i) =>
          visibleLines.includes(i) ? (
            <div key={i} style={{ color: line.color }} className={line.cursor ? "animate-pulse" : ""}>
              {line.text}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
