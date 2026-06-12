import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Settings, Bell, Users, Lock, Palette } from "lucide-react";

export const Route = createFileRoute("/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — SGAF" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const sections = [
    { icon: Users, title: "Usuarios y Roles", desc: "Gestiona accesos de administradores y profesores" },
    { icon: Lock, title: "Seguridad", desc: "Contraseñas, sesiones y autenticación de dos factores" },
    { icon: Bell, title: "Notificaciones", desc: "Alertas por correo y notificaciones del sistema" },
    { icon: Palette, title: "Apariencia", desc: "Personalización visual de la plataforma" },
    { icon: Settings, title: "Preferencias generales", desc: "Año académico, moneda, zona horaria" },
  ];
  return (
    <AppLayout title="Configuración" subtitle="Ajustes generales del sistema">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
