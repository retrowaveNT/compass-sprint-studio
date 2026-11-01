import { createFileRoute } from "@tanstack/react-router";
import { Bell, Moon, Palette, ShieldAlert, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TEAM, useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Настройки — Фокус" },
      { name: "description", content: "Профиль, тема оформления и уведомления команды." },
      { property: "og:title", content: "Настройки — Фокус" },
      { property: "og:description", content: "Профиль, тема оформления и уведомления команды." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
          on ? "left-[1.375rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="divide-y divide-border px-6">{children}</div>
    </section>
  );
}

function Row({
  label,
  hint,
  control,
}: {
  label: string;
  hint?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {control}
    </div>
  );
}

function Settings() {
  const { dark, toggle } = useTheme();
  const [name, setName] = useState(TEAM[0].name);
  const [email, setEmail] = useState("anna@company.ru");
  const [notifs, setNotifs] = useState({ mentions: true, deadlines: true, digest: false, ai: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Профиль, внешний вид и уведомления</p>
      </div>

      <Section icon={User} title="Профиль" hint="Как вас видит команда">
        <Row
          label="Имя"
          control={
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-56 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          }
        />
        <Row
          label="Эл. почта"
          control={
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-56 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          }
        />
        <Row
          label=""
          control={
            <button
              onClick={() => toast.success("Профиль сохранён")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Сохранить
            </button>
          }
        />
      </Section>

      <Section icon={Palette} title="Внешний вид" hint="Тема интерфейса">
        <Row
          label="Тёмная тема"
          hint="Переключается мгновенно и запоминается"
          control={
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Moon className="h-4 w-4" />
              <Toggle on={dark} onChange={toggle} />
            </span>
          }
        />
      </Section>

      <Section icon={Bell} title="Уведомления" hint="Что присылать и когда">
        <Row
          label="Упоминания"
          hint="Когда вас отмечают в комментариях"
          control={<Toggle on={notifs.mentions} onChange={() => setNotifs((n) => ({ ...n, mentions: !n.mentions }))} />}
        />
        <Row
          label="Дедлайны"
          hint="Напоминания за день до срока"
          control={<Toggle on={notifs.deadlines} onChange={() => setNotifs((n) => ({ ...n, deadlines: !n.deadlines }))} />}
        />
        <Row
          label="Еженедельный дайджест"
          hint="Сводка по понедельникам"
          control={<Toggle on={notifs.digest} onChange={() => setNotifs((n) => ({ ...n, digest: !n.digest }))} />}
        />
        <Row
          label="Советы ИИ-помощника"
          hint="Проактивные подсказки о рисках спринта"
          control={<Toggle on={notifs.ai} onChange={() => setNotifs((n) => ({ ...n, ai: !n.ai }))} />}
        />
      </Section>

      <Section icon={ShieldAlert} title="Опасная зона" hint="Действия без возврата">
        <Row
          label="Удалить рабочее пространство"
          hint="Все задачи, спринты и аналитика будут удалены"
          control={
            <button
              onClick={() => toast.error("В прототипе удаление отключено")}
              className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              Удалить
            </button>
          }
        />
      </Section>
    </div>
  );
}
