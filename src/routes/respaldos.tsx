import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ShieldCheck, DatabaseBackup, Download, CheckCircle2, HardDrive, Cloud, Clock } from "lucide-react";

export const Route = createFileRoute("/respaldos")({
  head: () => ({ meta: [{ title: "Copias de Seguridad — SGAF" }] }),
  component: RespaldosPage,
});

const backups = [
  { id: "BK-20260612", date: "12/06/2026", time: "03:00:14", size: "2.4 GB", type: "Automático", status: "Exitoso" },
  { id: "BK-20260611", date: "11/06/2026", time: "03:00:09", size: "2.4 GB", type: "Automático", status: "Exitoso" },
  { id: "BK-20260610", date: "10/06/2026", time: "03:00:11", size: "2.3 GB", type: "Automático", status: "Exitoso" },
  { id: "BK-20260609", date: "09/06/2026", time: "14:22:01", size: "2.3 GB", type: "Manual", status: "Exitoso" },
  { id: "BK-20260609a", date: "09/06/2026", time: "03:00:08", size: "2.3 GB", type: "Automático", status: "Exitoso" },
  { id: "BK-20260608", date: "08/06/2026", time: "03:00:13", size: "2.2 GB", type: "Automático", status: "Exitoso" },
];

function RespaldosPage() {
  return (
    <AppLayout title="Copias de Seguridad" subtitle="Control técnico de respaldos del sistema">
      <div className="rounded-2xl border border-success/20 bg-card p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-success/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-success text-success-foreground flex items-center justify-center shadow-lg shadow-success/20">
              <ShieldCheck className="h-10 w-10" strokeWidth={2.2} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-bold uppercase tracking-wide">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Sistema Protegido
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Todos los datos están seguros</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Último respaldo automático: <span className="font-semibold text-foreground">hoy a las 03:00 a.m.</span> · Próximo: mañana 03:00 a.m.
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20">
            <DatabaseBackup className="h-5 w-5" />
            Generar Respaldo Manual
          </button>
        </div>

        <div className="relative mt-7 grid gap-4 md:grid-cols-3">
          <InfoTile icon={HardDrive} label="Espacio usado" value="34.8 GB" sub="de 100 GB asignados" />
          <InfoTile icon={Cloud} label="Ubicación" value="Cloud + Local" sub="Replicación activa" />
          <InfoTile icon={Clock} label="Frecuencia" value="Diaria · 03:00" sub="Retención: 30 días" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-base font-bold">Historial de Respaldos</h2>
            <p className="text-xs text-muted-foreground">Respaldos automáticos diarios anteriores</p>
          </div>
          <span className="text-xs text-muted-foreground">{backups.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Hora</th>
                <th className="px-5 py-3">Tamaño</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{b.id}</td>
                  <td className="px-5 py-3 font-medium">{b.date}</td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{b.time}</td>
                  <td className="px-5 py-3">{b.size}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                      b.type === "Manual"
                        ? "bg-primary-soft text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2.5 py-0.5 text-[11px] font-semibold">
                      <CheckCircle2 className="h-3 w-3" /> {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-primary hover:bg-primary-soft">
                      <Download className="h-3.5 w-3.5" /> Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoTile({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-lg font-extrabold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
