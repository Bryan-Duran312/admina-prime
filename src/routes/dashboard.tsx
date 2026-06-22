import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { AdminDashboard } from "@/components/AdminDashboard";
import { RectorDashboard } from "@/components/RectorDashboard";
import { Users, TrendingUp, ShieldCheck, ArrowUpRight, GraduationCap, Wallet, DatabaseBackup, Activity, UserCog, Crown } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tablero — SGAF" }] }),
  component: DashboardRoute,
});

type Role = "teacher" | "admin" | "rector";

function DashboardRoute() {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "teacher";
    const stored = window.sessionStorage.getItem("sgaf_role");
    if (stored === "teacher" || stored === "admin" || stored === "rector") return stored;
    return "teacher";
  });
  const updateRole = (r: Role) => {
    setRole(r);
    try {
      sessionStorage.setItem("sgaf_role", r);
    } catch {}
  };
  const roles: { id: Role; label: string; icon: any }[] = [
    { id: "teacher", label: "Profesor", icon: GraduationCap },
    { id: "admin", label: "Administrador", icon: UserCog },
    { id: "rector", label: "Rector", icon: Crown },
  ];
  return (
    <div className="relative">
      {/* Selector temporal de rol (solo para pruebas) */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center justify-center gap-3 border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-xs dark:border-amber-900/60 dark:bg-amber-950/40">
        <span className="font-semibold text-amber-900 dark:text-amber-200">
          Vista de prueba:
        </span>
        <div className="inline-flex overflow-hidden rounded-lg border border-amber-300 dark:border-amber-800">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {r.label}
              </button>
            );
          })}
        </div>
      </div>
      {role === "teacher" && <Dashboard />}
      {role === "admin" && <AdminDashboard />}
      {role === "rector" && <RectorDashboard />}
    </div>
  );
}

function Dashboard() {
  return (
    <AppLayout title="Tablero Principal" subtitle="Resumen general del estado del colegio">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={Users}
          tone="primary"
          label="Total de Alumnos Matriculados"
          value="1,240"
          trend="+38 este mes"
        />
        <MetricCard
          icon={TrendingUp}
          tone="success"
          label="Alumnos al Día"
          value="98.2%"
          trend="+2.1% vs mes anterior"
          progress={98}
        />
        <MetricCard
          icon={ShieldCheck}
          tone="success"
          label="Estado del Respaldo"
          value="Protegido"
          trend="Último: hoy, 03:00 a.m."
          badge="Activo"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Actividad reciente</h2>
              <p className="text-xs text-muted-foreground">Últimos eventos del sistema</p>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Ver todo <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {[
              { icon: GraduationCap, txt: "Prof. Ramírez registró notas del 5°B — Matemáticas", time: "hace 12 min" },
              { icon: Wallet, txt: "Pago de mensualidad recibido: María López", time: "hace 34 min" },
              { icon: DatabaseBackup, txt: "Respaldo automático completado correctamente", time: "hoy, 03:00" },
              { icon: Activity, txt: "Nuevo alumno matriculado en 3°A", time: "ayer" },
            ].map((e, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                  <e.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-sm">{e.txt}</div>
                <div className="text-xs text-muted-foreground">{e.time}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold">Accesos rápidos</h2>
          <p className="text-xs text-muted-foreground">Módulos del sistema</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <QuickLink to="/notas" icon={GraduationCap} label="Notas" />
            <QuickLink to="/pagos" icon={Wallet} label="Pagos" />
            <QuickLink to="/respaldos" icon={DatabaseBackup} label="Respaldos" />
            <QuickLink to="/dashboard" icon={Activity} label="Reportes" />
          </div>

          <div className="mt-6 rounded-xl bg-primary-soft p-4">
            <div className="text-xs font-semibold text-primary">Periodo actual</div>
            <div className="mt-1 text-lg font-bold">2026 — II Trimestre</div>
            <div className="text-xs text-muted-foreground mt-1">Cierre: 15 de septiembre</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function MetricCard({
  icon: Icon, label, value, trend, tone = "primary", progress, badge,
}: {
  icon: any; label: string; value: string; trend: string;
  tone?: "primary" | "success"; progress?: number; badge?: string;
}) {
  const toneCls = tone === "success"
    ? "bg-success/10 text-success"
    : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl ${toneCls} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2.5 py-1 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> {badge}
          </span>
        )}
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 w-full rounded-full bg-muted">
          <div className="h-full rounded-full bg-success" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-primary hover:bg-primary-soft transition-colors"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  );
}
