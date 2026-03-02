import { useLocation, NavLink, Outlet } from "react-router-dom";

const Navigation = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/attacks", label: "Operations" },
  { path: "/agents", label: "Agents" },
  { path: "/targets", label: "Targets" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg font-sans text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-primary">⚡</div>
              <div>
                <p className="text-lg font-bold text-text-primary tracking-tight">FaultForge</p>
                <p className="text-xs text-text-muted">Chaos Engineering Platform</p>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              {Navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-text-muted hover:text-text-primary hover:bg-card"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-bg/50 py-4 text-center text-xs text-text-muted">
        <p>FaultForge • Controlled Chaos for System Resilience</p>
      </footer>
    </div>
  );
}
