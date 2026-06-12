import { Link, useRouterState } from "@tanstack/react-router";
import { Home, GraduationCap, Wallet, DatabaseBackup, Settings, LogOut, GraduationCap as Logo, Bell, Search, Sun, Moon } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/hooks/use-theme";

const nav = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/notas", label: "Notas", icon: GraduationCap },
  { to: "/pagos", label: "Pagos", icon: Wallet },
  { to: "/respaldos", label: "Copias de Seguridad", icon: DatabaseBackup },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

export function AppLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">SGAF</div>
            <div className="text-[11px] text-muted-foreground">Gestión Escolar</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/60">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar..."
                className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button onClick={toggleTheme} className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-accent transition-colors" title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-accent">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-2 py-1.5">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block leading-tight pr-1">
                <div className="text-xs font-semibold">Ana Domínguez</div>
                <div className="text-[10px] text-muted-foreground">Administrador</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
