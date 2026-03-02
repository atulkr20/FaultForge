"use client";

import { useEffect, useRef, useState } from "react";

const nodes = [
  // Control plane
  { id: "dashboard", label: "Dashboard", x: 20, y: 30, color: "#42b8ff", tier: "control" },
  { id: "control-panel", label: "Control Panel", x: 160, y: 30, color: "#ff3c3c", tier: "control" },
  { id: "queue", label: "Message Queue", x: 300, y: 30, color: "#f5c842", tier: "control" },
  { id: "db", label: "PostgreSQL", x: 420, y: 30, color: "#c084fc", tier: "control", chaos: false },
  
  // Agents tier
  { id: "agent1", label: "Agent #1", x: 60, y: 160, color: "#4cff91", tier: "agents" },
  { id: "agent2", label: "Agent #2", x: 160, y: 160, color: "#4cff91", tier: "agents" },
  { id: "agent3", label: "Agent #3", x: 260, y: 160, color: "#4cff91", tier: "agents" },
  { id: "agent4", label: "Agent #4", x: 360, y: 160, color: "#4cff91", tier: "agents" },
  { id: "agent5", label: "Agent #5", x: 460, y: 160, color: "#4cff91", tier: "agents" },
  
  // Target systems
  { id: "svc-a", label: "Service A", x: 60, y: 310, color: "#42b8ff", tier: "targets", chaos: true },
  { id: "svc-b", label: "Service B", x: 160, y: 310, color: "#4cff91", tier: "targets" },
  { id: "svc-c", label: "Service C", x: 260, y: 310, color: "#f5c842", tier: "targets" },
  { id: "svc-d", label: "Service D", x: 360, y: 310, color: "#c084fc", tier: "targets" },
];

const edges = [
  // Dashboard to Control Panel
  { from: "dashboard", to: "control-panel" },
  // Control Panel to Queue and DB
  { from: "control-panel", to: "queue" },
  { from: "control-panel", to: "db" },
  // Control Panel to Agents
  { from: "control-panel", to: "agent1" },
  { from: "control-panel", to: "agent2" },
  { from: "control-panel", to: "agent3" },
  { from: "control-panel", to: "agent4" },
  { from: "control-panel", to: "agent5" },
];

const chaosEdges = [
  // Agents inject faults into targets
  { from: "agent1", to: "svc-a", label: "inject" },
  { from: "agent2", to: "svc-b", label: "inject" },
  { from: "agent3", to: "svc-c", label: "inject" },
  { from: "agent4", to: "svc-d", label: "inject" },
];

export default function FFArchitecture() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1800);
    return () => clearInterval(t);
  }, []);

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const nodeCenter = (n: typeof nodes[0]) => ({
    x: n.x + 60,
    y: n.y + 18,
  });

  return (
    <section id="architecture" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#ff3c3c] tracking-widest mb-3 uppercase">Architecture</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#f5f5f5] leading-tight">
            Distributed Chaos Injection.
          </h2>
          <p className="text-[#666] mt-4 max-w-xl text-base leading-relaxed">
            Dashboard orchestrates control panel. Agents inject faults into target services across your entire infrastructure.
          </p>
        </div>

        {/* SVG Architecture Diagram */}
        <div className="bg-[#0d0d0f] border border-white/5 rounded-xl overflow-hidden p-6">
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 540 420"
              className="w-full max-w-2xl mx-auto"
              style={{ minWidth: 420 }}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="540" height="420" fill="url(#grid)" />

              {/* Normal edges */}
              {edges.map((edge) => {
                const from = nodeCenter(getNode(edge.from));
                const to = nodeCenter(getNode(edge.to));
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Chaos edges */}
              {chaosEdges.map((edge) => {
                const from = nodeCenter(getNode(edge.from));
                const to = nodeCenter(getNode(edge.to));
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                return (
                  <g key={`chaos-${edge.from}-${edge.to}`}>
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#ff3c3c"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                      opacity={pulse ? 0.9 : 0.4}
                      style={{ transition: "opacity 0.8s ease" }}
                    />
                    <text
                      x={mx} y={my - 6}
                      fill="#ff3c3c"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      opacity={pulse ? 0.9 : 0.4}
                      style={{ transition: "opacity 0.8s ease" }}
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {node.chaos && (
                    <rect
                      x="-3" y="-3" width="126" height="42" rx="5"
                      fill="none"
                      stroke="#ff3c3c"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                      opacity={pulse ? 0.8 : 0.3}
                      style={{ transition: "opacity 0.8s ease" }}
                    />
                  )}
                  <rect
                    width="120" height="36" rx="4"
                    fill={`${node.color}12`}
                    stroke={node.id === "faultforge" ? "#ff3c3c" : `${node.color}30`}
                    strokeWidth={node.id === "faultforge" ? "1.5" : "1"}
                  />
                  <text
                    x="60" y="22"
                    fill={node.color}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={node.id === "faultforge" ? "bold" : "normal"}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  {node.id === "faultforge" && (
                    <circle cx="10" cy="18" r="4" fill="#ff3c3c" opacity={pulse ? 1 : 0.3} style={{ transition: "opacity 0.8s ease" }} />
                  )}
                </g>
              ))}
            </svg>
          </div>
          <p className="text-center text-xs font-mono text-[#444] mt-4">
            ↑ Live fault injection visualization — FaultForge targets any node in your topology
          </p>
        </div>
      </div>
    </section>
  );
}
