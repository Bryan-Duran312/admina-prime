import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  DollarSign,
  UserPlus,
  AlertTriangle,
  Send,
  Wallet,
  ShieldCheck,
  DatabaseBackup,
  Plus,
  Mail,
  UserCog,
  CheckCircle2,
  Clock,
  HardDrive,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: any };

const adminNav: NavItem[] = [
  { to: "/dashboard", label: "Inicio", icon: Wallet },
  { to: "/pagos", label: "Pagos", icon: Wallet },
  { to: "/respaldos", label: "Copias de Seguridad", icon: DatabaseBackup },
  { to: "/configuracion", label: "Configuración", icon: ShieldCheck },
];

export function AdminDashboard({ navItems }: { navItems?: NavItem[] }) {
  return (
    <AppLayout
      title="Panel de Administración"
      subtitle="Control financiero, usuarios y respaldos del sistema"
      navItems={navItems ?? adminNav}
    >
      {/* Métricas */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AdminMetric
          icon={DollarSign}
          tone="success"
          label="Ingresos del día"
          value="$ 12,480"
          trend="+18% vs ayer"
        />
        <AdminMetric
          icon={UserPlus}
          tone="primary"
          label="Matrículas nuevas"
          value="27"
          trend="Esta semana"
        />
        <AdminMetric
          icon={AlertTriangle}
          tone="warning"
          label="Morosidad"
          value="4.6%"
          trend="57 alumnos pendientes"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Pagos pendientes */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Pagos Pendientes</h2>
              <p className="text-xs text-muted-foreground">
                Cuotas vencidas o por vencer
              </p>
            </div>
            <span className="rounded-full bg-warning/10 text-warning px-2.5 py-1 text-[11px] font-semibold">
              57 pendientes
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">Alumno</th>
                  <th className="text-left font-semibold px-4 py-2.5">Grado</th>
                  <th className="text-left font-semibold px-4 py-2.5">Concepto</th>
                  <th className="text-right font-semibold px-4 py-2.5">Monto</th>
                  <th className="text-left font-semibold px-4 py-2.5">Vence</th>
                  <th className="text-right font-semibold px-4 py-2.5">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "María López G.", grade: "5°B", c: "Mensualidad Junio", amt: "$ 220", due: "15/06" },
                  { name: "Carlos Pérez R.", grade: "3°A", c: "Mensualidad Junio", amt: "$ 220", due: "15/06" },
                  { name: "Lucía Fernández", grade: "6°C", c: "Matrícula 2026", amt: "$ 480", due: "18/06" },
                  { name: "Diego Salinas", grade: "2°A", c: "Mensualidad Mayo", amt: "$ 220", due: "Vencido" },
                  { name: "Ana Castillo", grade: "4°B", c: "Mensualidad Junio", amt: "$ 220", due: "20/06" },
                ].map((r, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.grade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.c}</td>
                    <td className="px-4 py-3 text-right font-semibold">{r.amt}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${r.due === "Vencido" ? "text-destructive" : "text-muted-foreground"}`}>
                        {r.due}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-semibold hover:bg-primary/90">
                          <Wallet className="h-3.5 w-3.5" /> Registrar pago
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-lg border border-input px-2.5 py-1.5 text-xs font-semibold hover:bg-accent">
                          <Send className="h-3.5 w-3.5" /> Recordatorio
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Copias de Seguridad */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Copias de Seguridad</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2.5 py-1 text-[11px] font-semibold">
              <ShieldCheck className="h-3 w-3" /> Protegido
            </span>
          </div>

          <div className="mt-5 rounded-xl bg-success/5 border border-success/20 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <DatabaseBackup className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">Último respaldo</div>
                <div className="text-xs text-muted-foreground">Hoy, 03:00 a.m. — 1.2 GB</div>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2.5 text-sm font-semibold hover:bg-primary/90">
            <DatabaseBackup className="h-4 w-4" /> Forzar respaldo manual
          </button>

          <div className="mt-5 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Historial reciente
            </div>
            {[
              { d: "22/06 03:00", s: "ok", txt: "Automático diario" },
              { d: "21/06 03:00", s: "ok", txt: "Automático diario" },
              { d: "20/06 14:22", s: "manual", txt: "Manual (A. Domínguez)" },
              { d: "20/06 03:00", s: "ok", txt: "Automático diario" },
            ].map((b, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  {b.s === "manual" ? (
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  )}
                  <span className="font-medium">{b.txt}</span>
                </div>
                <span className="text-muted-foreground">{b.d}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <HardDrive className="h-3.5 w-3.5" /> Almacenamiento: 18.4 / 50 GB
          </div>
        </div>
      </div>

      {/* Gestión de Usuarios */}
      <UserManagementSection />
    </AppLayout>
  );
}

function UserManagementSection() {
  const [teachers] = useState([
    { name: "Carlos Ramírez", email: "c.ramirez@sgaf.edu", area: "Matemáticas", status: "Activo" },
    { name: "Lucía Martínez", email: "l.martinez@sgaf.edu", area: "Lenguaje", status: "Activo" },
    { name: "Jorge Silva", email: "j.silva@sgaf.edu", area: "Ciencias", status: "Inactivo" },
    { name: "Patricia Vega", email: "p.vega@sgaf.edu", area: "Historia", status: "Activo" },
  ]);

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold">Gestión de Usuarios — Profesores</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Crea y administra los perfiles del personal docente
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Crear nuevo profesor
        </button>
      </div>

      {/* Formulario rápido */}
      <div className="mt-5 grid gap-3 md:grid-cols-4 rounded-xl border border-dashed border-border p-4 bg-muted/20">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Nombre completo</label>
          <input className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Ej. Andrea Soto" />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Correo institucional</label>
          <input className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="a.soto@sgaf.edu" />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Área / Materia</label>
          <input className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Ej. Biología" />
        </div>
        <div className="flex items-end">
          <button className="h-9 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-input text-sm font-semibold hover:bg-accent">
            <Mail className="h-4 w-4" /> Enviar invitación
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-4 py-2.5">Profesor</th>
              <th className="text-left font-semibold px-4 py-2.5">Correo</th>
              <th className="text-left font-semibold px-4 py-2.5">Área</th>
              <th className="text-left font-semibold px-4 py-2.5">Estado</th>
              <th className="text-right font-semibold px-4 py-2.5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                <td className="px-4 py-3">{t.area}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    t.status === "Activo"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-primary hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminMetric({
  icon: Icon, label, value, trend, tone = "primary",
}: {
  icon: any; label: string; value: string; trend: string;
  tone?: "primary" | "success" | "warning";
}) {
  const toneCls =
    tone === "success" ? "bg-success/10 text-success"
    : tone === "warning" ? "bg-warning/10 text-warning"
    : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl ${toneCls} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      </div>
    </div>
  );
}
