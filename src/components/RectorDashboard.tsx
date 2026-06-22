import { AppLayout } from "@/components/AppLayout";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GraduationCap,
  Users,
  Wallet,
  AlertTriangle,
  TrendingDown,
  FileText,
  ScrollText,
  ShieldAlert,
  Activity,
  BarChart3,
  Home,
  Settings,
} from "lucide-react";

const revenueData = [
  { m: "Ene", v: 92_400 },
  { m: "Feb", v: 98_100 },
  { m: "Mar", v: 105_800 },
  { m: "Abr", v: 102_300 },
  { m: "May", v: 118_600 },
  { m: "Jun", v: 124_900 },
];

const gradeData = [
  { g: "1°", v: 8.9 },
  { g: "2°", v: 8.7 },
  { g: "3°", v: 8.4 },
  { g: "4°", v: 8.2 },
  { g: "5°", v: 8.1 },
  { g: "6°", v: 7.9 },
  { g: "7°", v: 7.6 },
  { g: "8°", v: 6.8 },
  { g: "9°", v: 7.4 },
  { g: "10°", v: 7.8 },
  { g: "11°", v: 8.3 },
];

const rectorNav = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/dashboard", label: "Estadísticas", icon: BarChart3 },
  { to: "/configuracion", label: "Auditoría", icon: ScrollText },
  { to: "/pagos", label: "Finanzas", icon: Wallet },
  { to: "/respaldos", label: "Copias de Seguridad", icon: Activity },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

export function RectorDashboard() {
  return (
    <AppLayout
      title="Panel del Rector"
      subtitle="Inteligencia de negocio y supervisión institucional"
      navItems={rectorNav}
    >
      {/* Métricas globales */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <BIMetric
          icon={GraduationCap}
          tone="primary"
          label="Promedio Académico Institucional"
          value="8.1 / 10"
          trend="+0.3 vs trimestre anterior"
        />
        <BIMetric
          icon={Users}
          tone="success"
          label="Tasa de Retención de Alumnos"
          value="96.4 %"
          trend="1,196 de 1,240 alumnos"
        />
        <BIMetric
          icon={Wallet}
          tone="primary"
          label="Presupuesto Total Mensual"
          value="$ 124,900"
          trend="+5.3% sobre lo proyectado"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Tendencia de ingresos</h2>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
            <span className="rounded-full bg-success/10 text-success px-2.5 py-1 text-[11px] font-semibold">
              +35% semestral
            </span>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$ ${v.toLocaleString()}`, "Ingresos"]}
                />
                <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div>
            <h2 className="text-base font-bold">Rendimiento por grado</h2>
            <p className="text-xs text-muted-foreground">Promedio 1° a 11°</p>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="g" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v.toFixed(1)}`, "Promedio"]}
                />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alertas estratégicas + Auditoría */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning" />
              <h2 className="text-base font-bold">Alertas estratégicas</h2>
            </div>
            <span className="rounded-full bg-warning/10 text-warning px-2.5 py-1 text-[11px] font-semibold">
              4 críticas
            </span>
          </div>

          <ul className="mt-5 space-y-3">
            {[
              {
                icon: TrendingDown,
                tone: "destructive",
                title: "Bajo rendimiento detectado en Matemáticas 8°",
                detail: "Promedio del curso: 6.8 — 22% por debajo del estándar institucional",
              },
              {
                icon: AlertTriangle,
                tone: "warning",
                title: "5 alumnos en riesgo de deserción por impago",
                detail: "Mora superior a 60 días — requiere intervención de coordinación",
              },
              {
                icon: TrendingDown,
                tone: "warning",
                title: "Asistencia docente bajo el 90% en Ciencias",
                detail: "Profesor J. Silva — 7 inasistencias en el mes",
              },
              {
                icon: AlertTriangle,
                tone: "destructive",
                title: "Variación presupuestaria en gastos operativos",
                detail: "+12% sobre lo planificado en mantenimiento e insumos",
              },
            ].map((a, i) => {
              const toneCls =
                a.tone === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-warning/10 text-warning";
              return (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <div className={`h-9 w-9 shrink-0 rounded-lg ${toneCls} flex items-center justify-center`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.detail}</div>
                  </div>
                  <button className="text-xs font-semibold text-primary hover:underline">
                    Revisar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold">Auditoría y reportes</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Supervisión de modificaciones y exportación ejecutiva
          </p>

          <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2.5 text-sm font-semibold hover:bg-primary/90">
            <FileText className="h-4 w-4" /> Generar Reporte Institucional PDF
          </button>

          <button className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2.5 text-sm font-semibold hover:bg-accent">
            <ScrollText className="h-4 w-4" /> Ver Bitácora de Cambios
          </button>

          <div className="mt-5 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Últimos eventos auditados
            </div>
            {[
              { u: "Prof. C. Ramírez", a: "Modificó nota — 5°B Matemáticas", t: "hace 12 min" },
              { u: "A. Domínguez", a: "Registró pago — M. López", t: "hace 1 h" },
              { u: "L. Martínez", a: "Editó nota — 7°A Lenguaje", t: "ayer" },
              { u: "Sistema", a: "Respaldo automático completado", t: "hoy 03:00" },
            ].map((e, i) => (
              <div key={i} className="rounded-lg border border-border p-2.5 text-xs">
                <div className="font-semibold">{e.u}</div>
                <div className="text-muted-foreground">{e.a}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{e.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function BIMetric({
  icon: Icon,
  label,
  value,
  trend,
  tone = "primary",
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  tone?: "primary" | "success" | "warning";
}) {
  const toneCls =
    tone === "success"
      ? "bg-success/10 text-success"
      : tone === "warning"
        ? "bg-warning/10 text-warning"
        : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-sm transition-shadow">
      <div className={`h-11 w-11 rounded-xl ${toneCls} flex items-center justify-center`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      </div>
    </div>
  );
}
