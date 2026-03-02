import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface AuthSplitShellProps {
  title: string;
  subtext: string;
  switchLabel: string;
  switchTo: string;
  switchText: string;
  children: ReactNode;
  submitLabel: string;
  loadingLabel: string;
  loading?: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function AuthSplitShell({
  title,
  subtext,
  switchLabel,
  switchTo,
  switchText,
  children,
  submitLabel,
  loadingLabel,
  loading = false,
  onSubmit,
}: AuthSplitShellProps) {
  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f5f5] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,60,60,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,60,60,0.035) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[460px] rounded-full bg-[#ff3c3c]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#ff3c3c] font-mono">
          <Zap className="w-4 h-4" />
          <span className="text-xl font-semibold tracking-tight">FaultForge</span>
        </Link>
      </div>

      <main className="relative z-10 -mt-2 px-6 pb-10 flex items-center justify-center">
        <section className="w-full max-w-md sm:max-w-lg border border-white/10 bg-[#0d0d0f]/85 backdrop-blur-sm rounded-xl p-6 sm:p-8">
          <p className="text-xs font-mono text-[#ff3c3c] tracking-wider uppercase mb-3">Chaos Engineering Platform</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-[#888] text-sm">
            {switchLabel}{" "}
            <Link to={switchTo} className="text-[#ff3c3c] hover:text-[#ff8c42] transition-colors">
              {switchText}
            </Link>
          </p>

          <form className="mt-7 space-y-5" onSubmit={onSubmit}>
            {children}
            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-[#ff3c3c] hover:bg-[#ff5555] text-white text-sm font-semibold font-mono transition-all duration-200 shadow-[0_0_30px_rgba(255,60,60,0.28)] hover:shadow-[0_0_40px_rgba(255,60,60,0.4)]"
            >
              {loading ? loadingLabel : submitLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-[#555] text-xs sm:text-sm">{subtext}</p>
        </section>
      </main>
    </div>
  );
}
