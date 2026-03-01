import { Bomb, Globe, LayoutDashboard, ServerCog, Settings, ShieldAlert, Zap } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Board", icon: LayoutDashboard },
  { to: "/dashboard#agents", label: "Fleet", icon: ServerCog },
  { to: "/attacks", label: "Ops", icon: Bomb },
  { to: "/targets", label: "Targets", icon: Globe },
  { to: "/settings", label: "Config", icon: Settings },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 md:px-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-warning/35 bg-card px-3 py-2">
            <span className="rounded-sm border border-warning/35 bg-warning/10 p-1 text-warning">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.08em]">FAULTFORGE</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Chaos Command Deck</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={`${item.to}-${item.label}`}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
                    isActive
                      ? "border-warning/40 bg-warning/10 text-text-primary"
                      : "border-border bg-card text-text-muted hover:border-warning/30 hover:text-text-primary"
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-text-muted">
            <ShieldAlert className="h-3.5 w-3.5 text-warning" />
            Live Exercise Mode
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-5 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
