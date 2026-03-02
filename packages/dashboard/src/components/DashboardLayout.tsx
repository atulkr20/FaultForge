import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FlaskConical,
  Cpu,
  ScrollText,
  BarChart3,
  Settings,
  Zap,
  Github,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [activeExperiments] = useState(0);

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/experiments", label: "Experiments", icon: FlaskConical },
    { path: "/agents", label: "Agents", icon: Cpu },
    { path: "/logs", label: "Live Logs", icon: ScrollText },
    { path: "/metrics", label: "Metrics", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const currentItem = navItems.find((item) => {
    if (item.path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  });

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f5f5] font-mono">
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-[290px] bg-[#040407] border-r border-[#ff3c3c]/15">
        <div className="h-[74px] px-7 border-b border-[#ff3c3c]/15 flex items-center">
          <Link to="/" className="flex items-center gap-3 text-[#ff3c3c]">
            <Zap className="w-3.5 h-3.5" strokeWidth={2.3} />
            <span className="text-[1.85rem] leading-none tracking-tight font-semibold">FaultForge</span>
          </Link>
        </div>

        <nav className="px-3 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname === "/");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-5 py-3 rounded-md border transition-all text-[1.03rem] tracking-tight ${
                  isActive
                    ? "text-[#ff6155] border-[#ff3c3c]/45 bg-[#3a080b]"
                    : "text-[#6f737a] border-transparent hover:text-[#f5f5f5] hover:border-white/10 hover:bg-white/[0.02]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 h-[74px] px-7 border-t border-[#ff3c3c]/15 flex items-center">
          <span className="text-[#41454c] uppercase tracking-widest text-[0.66rem]">
            {activeExperiments} experiments active
          </span>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-[290px]">
        <header className="h-[64px] lg:h-[74px] border-b border-[#ff3c3c]/15 flex items-center justify-between px-5 md:px-8 lg:px-10">
          <div className="flex items-center gap-3 text-sm tracking-tight">
            <span className="text-[#64676e]">Dashboard</span>
            <span className="text-[#45484f]">&gt;</span>
            <span className="text-[#f5f5f5]">{currentItem?.label ?? "Overview"}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 border border-white/10 rounded-md text-[#858a90] text-xs">
              <div
                className={`w-1.5 h-1.5 rounded-full ${activeExperiments > 0 ? "bg-[#ff3c3c]" : "bg-[#4a4f58]"}`}
              ></div>
              <span>{activeExperiments > 0 ? `${activeExperiments} active` : "No active experiments"}</span>
            </div>

            <a
              href="https://github.com/atulkr20/faultforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 md:px-4 py-2 text-sm text-[#858a90] hover:text-[#f5f5f5] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </header>

        <nav className="lg:hidden border-b border-[#ff3c3c]/10 px-3 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/dashboard" && location.pathname === "/");

              return (
                <Link
                  key={`mobile-${item.path}`}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md border text-xs tracking-wide ${
                    isActive
                      ? "text-[#ff6155] border-[#ff3c3c]/45 bg-[#3a080b]"
                      : "text-[#717780] border-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="p-5 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
