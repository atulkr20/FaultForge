"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";

export default function FFNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#060608]/90 backdrop-blur-xl border-b border-[#ff3c3c]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#ff3c3c] font-mono font-bold text-lg tracking-tight">FaultForge</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Architecture", "How It Works", "Stack"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-[#888] hover:text-[#f5f5f5] transition-colors duration-200 font-mono"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/atulkr20/faultforge"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff3c3c] hover:bg-[#ff5555] text-white text-sm font-semibold font-mono transition-all duration-200 shadow-[0_0_30px_rgba(255,60,60,0.3)]"
        >
          <Github className="w-4 h-4" />
          GitHub
        </a>
      </div>
    </nav>
  );
}
