import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ChevronDown, History, Save, Download, X, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/notas")({
  head: () => ({ meta: [{ title: "Notas — SGAF" }] }),
  component: NotasPage,
});

const students = [
  { id: "A-1041", name: "María López Vargas", n1: 18, n2: 17, n3: 19, n4: 18 },
  { id: "A-1042", name: "Carlos Mendoza Ruiz", n1: 15, n2: 14, n3: 16, n4: 15 },
  { id: "A-1043", name: "Lucía Fernández Paz", n1: 19, n2: 20, n3: 18, n4: 19 },
  { id: "A-1044", name: "Diego Salazar Quispe", n1: 13, n2: 14, n3: 13, n4: 14 },
  { id: "A-1045", name: "Camila Rojas Díaz", n1: 17, n2: 18, n3: 17, n4: 18 },
  { id: "A-1046", name: "Andrés Torres Silva", n1: 16, n2: 15, n3: 17, n4: 16 },
  { id: "A-1047", name: "Sofía Núñez Aliaga", n1: 20, n2: 19, n3: 20, n4: 19 },
  { id: "A-1048", name: "Jorge Castillo Vega", n1: 12, n2: 13, n3: 14, n4: 13 },
];

const history = [
  { date: "12/06/2026 10:24", user: "Prof. Ramírez", prev: "16", next: "18", reason: "Recalificación de examen parcial" },
  { date: "10/06/2026 14:10", user: "Prof. Ramírez", prev: "—", next: "16", reason: "Registro inicial de nota" },
  { date: "05/06/2026 09:02", user: "Admin. A. Domínguez", prev: "15", next: "16", reason: "Corrección por error de tipeo" },
];

function gradeColor(n: number) {
  if (n >= 18) return "text-success border-success/30 bg-success/5";
  if (n >= 14) return "text-primary border-primary/20 bg-primary-soft";
  return "text-destructive border-destructive/30 bg-destructive/5";
}

function NotasPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppLayout title="Módulo Académico" subtitle="Gestión y registro de calificaciones">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
          <Filter className="h-3.5 w-3.5" /> FILTROS
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="Curso" options={["5° Secundaria — B", "5° Secundaria — A", "4° Secundaria — B"]} />
          <Select label="Materia" options={["Matemáticas", "Comunicación", "Ciencia y Tecnología", "Historia"]} />
          <Select label="Periodo" options={["II Trimestre 2026", "I Trimestre 2026", "III Trimestre 2025"]} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="text-base font-bold">Calificaciones — 5°B Matemáticas</h2>
            <p className="text-xs text-muted-foreground">{students.length} alumnos · II Trimestre 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-input text-sm font-medium hover:bg-accent">
              <Download className="h-4 w-4" /> Exportar
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
              <Save className="h-4 w-4" /> Guardar cambios
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">ID Alumno</th>
                <th className="px-5 py-3">Nombre del Alumno</th>
                <th className="px-3 py-3 text-center">Nota 1</th>
                <th className="px-3 py-3 text-center">Nota 2</th>
                <th className="px-3 py-3 text-center">Nota 3</th>
                <th className="px-3 py-3 text-center">Nota 4</th>
                <th className="px-3 py-3 text-center">Promedio</th>
                <th className="px-5 py-3 text-right">Historial</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const avg = ((s.n1 + s.n2 + s.n3 + s.n4) / 4).toFixed(1);
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                    <td className="px-5 py-3 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[11px] font-bold">
                          {s.name.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    {[s.n1, s.n2, s.n3, s.n4].map((n, i) => (
                      <td key={i} className="px-3 py-3 text-center">
                        <input
                          defaultValue={n}
                          className={`h-9 w-14 rounded-lg border text-center font-semibold outline-none focus:ring-2 focus:ring-primary/20 ${gradeColor(n)}`}
                        />
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center">
                      <span className="font-bold">{avg}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setOpen(s.id)}
                        className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-primary hover:bg-primary-soft"
                      >
                        <History className="h-3.5 w-3.5" /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <Modal onClose={() => setOpen(null)} student={students.find((s) => s.id === open)!} />
      )}
    </AppLayout>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="relative mt-1">
        <select className="h-10 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function Modal({ onClose, student }: { onClose: () => void; student: { id: string; name: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-card shadow-2xl border border-border overflow-hidden">
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="text-xs font-semibold text-primary">HISTORIAL DE CAMBIOS</div>
            <h3 className="mt-1 text-lg font-bold">{student.name}</h3>
            <p className="text-xs text-muted-foreground">ID {student.id} · Matemáticas · II Trimestre 2026</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-lg border border-input flex items-center justify-center hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">Fecha / Hora</th>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Valor Anterior</th>
                <th className="px-5 py-3">Valor Nuevo</th>
                <th className="px-5 py-3">Motivo del Cambio</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{h.date}</td>
                  <td className="px-5 py-3 font-medium">{h.user}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-md bg-destructive/5 text-destructive border border-destructive/20 px-2 py-0.5 font-semibold">
                      {h.prev}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-md bg-success/10 text-success border border-success/20 px-2 py-0.5 font-semibold">
                      {h.next}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{h.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border p-4 bg-muted/30">
          <span className="text-xs text-muted-foreground">{history.length} modificaciones registradas</span>
          <button onClick={onClose} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
