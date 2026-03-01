import { ShieldAlert, LayoutDashboard, ServerCog, Bomb, Settings, Zap } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Agents", icon: ServerCog },
  { to: "/attacks", label: "Attacks", icon: Bomb },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavItems({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={cn("gap-2", mobile ? "grid grid-cols-4" : "flex flex-col") }>
      {navItems.map((item) => (
        <NavLink
          key={`${item.to}-${item.label}`}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-150",
              isActive
                ? "bg-primary/25 text-text-primary"
                : "text-text-muted hover:bg-border/70 hover:text-text-primary",
              mobile && "justify-center"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {!mobile && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 md:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur md:flex md:flex-col">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="rounded-lg bg-primary/20 p-2 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">FaultForge</p>
              <p className="text-xs text-text-muted">Chaos Control</p>
            </div>
          </div>
          <NavItems />
          <div className="mt-auto rounded-lg border border-border bg-bg p-3 text-xs text-text-muted">
            <div className="mb-2 inline-flex items-center gap-2 text-warning">
              <ShieldAlert className="h-4 w-4" />
              Live exercise mode
            </div>
            Attack execution is real-time against registered agents.
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-2 backdrop-blur md:hidden">
        <NavItems mobile />
      </div>
    </div>
  );
}