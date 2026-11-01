import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Crosshair, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { useTheme } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — Фокус" },
      { name: "description", content: "Войдите в Фокус — трекер задач вашей команды." },
      { property: "og:title", content: "Вход — Фокус" },
      { property: "og:description", content: "Войдите в Фокус — трекер задач вашей команды." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const STATS = [
  { value: "12 400+", label: "команд уже в фокусе" },
  { value: "98%", label: "задач закрываются в срок" },
  { value: "4.9", label: "средняя оценка команд" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel */}
      <div className="hidden flex-1 flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Crosshair className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">Фокус</span>
        </div>

        <div className="max-w-md">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Трекер задач для команд
          </p>
          <h1 className="font-display text-4xl leading-tight font-semibold">
            Общий фокус.
            <br />
            Заметный прогресс.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Доска, бэклог, спринты и аналитика в одном месте. ИИ-помощник следит за сроками,
            пока команда делает дело.
          </p>

          <div className="mt-10 space-y-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-4 border-b border-border pb-4">
                <span className="font-display w-24 text-2xl font-semibold text-primary">
                  {s.value}
                </span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Фокус. Сделано с любовью к порядку.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center border-l border-border bg-card p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">С возвращением</h2>
            <button
              onClick={toggle}
              aria-label="Переключить тему"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Войдите, чтобы продолжить работу с задачами команды.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Эл. почта
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anna@company.ru"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
                Запомнить меня
              </label>
              <button type="button" className="font-medium text-primary hover:underline">
                Забыли пароль?
              </button>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Войти
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <button className="font-medium text-primary hover:underline">
              Создать команду
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
