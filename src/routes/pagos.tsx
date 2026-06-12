import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Search, Banknote, Building2, Wallet, CheckCircle2, Clock, FileDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/pagos")({
  head: () => ({ meta: [{ title: "Pagos — SGAF" }] }),
  component: PagosPage,
});

const transactions = [
  { id: "TR-00198", student: "María López Vargas", concept: "Mensualidad — Junio", amount: 480, method: "Transferencia", date: "12/06/2026", status: "Pagado" },
  { id: "TR-00197", student: "Andrés Torres Silva", concept: "Mensualidad — Junio", amount: 480, method: "Efectivo", date: "12/06/2026", status: "Pagado" },
  { id: "TR-00196", student: "Sofía Núñez Aliaga", concept: "Matrícula", amount: 1200, method: "Transferencia", date: "11/06/2026", status: "Pagado" },
  { id: "TR-00195", student: "Jorge Castillo Vega", concept: "Mensualidad — Mayo", amount: 480, method: "Efectivo", date: "10/06/2026", status: "Pendiente" },
  { id: "TR-00194", student: "Lucía Fernández Paz", concept: "Mensualidad — Junio", amount: 480, method: "Transferencia", date: "10/06/2026", status: "Pagado" },
];

function PagosPage() {
  const [method, setMethod] = useState<"Efectivo" | "Transferencia">("Transferencia");

  return (
    <AppLayout title="Módulo Financiero" subtitle="Registro y control de mensualidades">
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Buscar alumno por nombre, ID o concepto..."
          className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 h-fit sticky top-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Registrar Nuevo Pago</h2>
              <p className="text-xs text-muted-foreground">Completa los datos</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">Alumno</label>
              <input placeholder="Selecciona alumno" className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">Concepto</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Mensualidad — Junio</option>
                <option>Matrícula</option>
                <option>Material académico</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">Monto (S/)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">S/</span>
                <input type="number" defaultValue={480} className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">Método de Pago</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { v: "Efectivo", icon: Banknote },
                  { v: "Transferencia", icon: Building2 },
                ].map((m) => (
                  <button
                    key={m.v}
                    onClick={() => setMethod(m.v as any)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      method === m.v
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${method === m.v ? "border-primary" : "border-muted-foreground/40"}`}>
                      {method === m.v && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <m.icon className="h-4 w-4" />
                    {m.v === "Transferencia" ? "Transf." : m.v}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-sm">
              Registrar Pago
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-base font-bold">Transacciones Recientes</h2>
              <p className="text-xs text-muted-foreground">Últimos pagos registrados</p>
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-input text-sm font-medium hover:bg-accent">
              <FileDown className="h-4 w-4" /> Reporte
            </button>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <Stat label="Recaudado hoy" value="S/ 3,120" />
            <Stat label="Este mes" value="S/ 48,920" />
            <Stat label="Pendientes" value="12" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Alumno</th>
                  <th className="px-5 py-3">Concepto</th>
                  <th className="px-5 py-3">Método</th>
                  <th className="px-5 py-3 text-right">Monto</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                    <td className="px-5 py-3 font-medium">{t.student}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.concept}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        {t.method === "Efectivo" ? <Banknote className="h-3.5 w-3.5 text-muted-foreground" /> : <Building2 className="h-3.5 w-3.5 text-muted-foreground" />}
                        {t.method}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold">S/ {t.amount}</td>
                    <td className="px-5 py-3">
                      {t.status === "Pagado" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2.5 py-0.5 text-[11px] font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Pagado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 text-warning px-2.5 py-0.5 text-[11px] font-semibold" style={{ color: "oklch(0.55 0.16 75)" }}>
                          <Clock className="h-3 w-3" /> Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5">
      <div className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
