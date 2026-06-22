import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Lock, User, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iniciar Sesión — SGAF" },
      { name: "description", content: "Acceso para profesores y administradores al Sistema de Gestión Académica y Financiera." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Administrador");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const roleMap: Record<string, "teacher" | "admin" | "rector"> = {
      Profesor: "teacher",
      Administrador: "admin",
      Rector: "rector",
    };
    const target = roleMap[role] ?? "admin";
    setTimeout(() => {
      try {
        sessionStorage.setItem("sgaf_role", target);
      } catch {}
      navigate({ to: "/dashboard" });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 text-primary-foreground overflow-hidden"
           style={{ background: "linear-gradient(135deg, oklch(0.42 0.18 255), oklch(0.58 0.2 250))" }}>
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">SGAF</div>
            <div className="text-xs text-white/70">Sistema de Gestión Escolar</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Toda la gestión académica y financiera de tu colegio, en un solo lugar.
          </h2>
          <p className="text-white/80 text-base">
            Notas, pagos, respaldos automáticos y trazabilidad completa de cambios. Pensado para equipos administrativos y docentes.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { k: "1.240", v: "Alumnos" },
              { k: "98%", v: "Al día" },
              { k: "24/7", v: "Respaldo" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="text-2xl font-bold">{s.k}</div>
                <div className="text-xs text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/70">
          <ShieldCheck className="h-4 w-4" />
          Conexión cifrada · ISO 27001
        </div>

        {/* decorative orbs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="font-bold">SGAF</div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder al panel.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">ROL</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>Administrador</option>
                  <option>Profesor</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">USUARIO</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="usuario@colegio.edu"
                  className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">CONTRASEÑA</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" />
                Recordarme
              </label>
              <a href="#" className="font-semibold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              Iniciar sesión
            </button>

            <p className="text-center text-xs text-muted-foreground">
              ¿Problemas para acceder? <Link to="/" className="text-primary font-semibold">Contacta soporte</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
