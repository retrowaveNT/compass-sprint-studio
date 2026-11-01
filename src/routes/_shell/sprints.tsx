import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, CheckCircle2, CircleDashed, PlayCircle } from "lucide-react";

import { SPRINTS, useTasks, type Sprint } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/sprints")({
  head: () => ({
    meta: [
      { title: "Спринты — Фокус" },
      { name: "description", content: "Спринты команды: цели, сроки и прогресс выполнения." },
      { property: "og:title", content: "Спринты — Фокус" },
      { property: "og:description", content: "Спринты команды: цели, сроки и прогресс выполнения." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sprints,
});

const STATE_META = {
  active: { label: "Активный", icon: PlayCircle, style: "bg-primary/10 text-primary" },
  planned: { label: "Запланирован", icon: CircleDashed, style: "bg-secondary text-secondary-foreground" },
  completed: { label: "Завершён", icon: CheckCircle2, style: "bg-[color-mix(in_oklch,var(--success)_15%,transparent)] text-[var(--success)]" },
} as const;

function SprintCard({ sprint }: { sprint: Sprint }) {
  const { tasks, openTask } = useTasks();
  const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
  const done = sprintTasks.filter((t) => t.status === "done").length;
  const pct = sprintTasks.length ? Math.round((done / sprintTasks.length) * 100) : 0;
  const meta = STATE_META[sprint.state];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold">{sprint.name}</h2>
        <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", meta.style)}>
          <meta.icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarRange className="h-4 w-4" />
          {sprint.start} — {sprint.end}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Цель: {sprint.goal}</p>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">
            {done} из {sprintTasks.length} задач
          </span>
          <span className="text-primary">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {sprintTasks.length > 0 && (
        <div className="mt-5 divide-y divide-border border-t border-border">
          {sprintTasks.map((t) => (
            <button
              key={t.id}
              onClick={() => openTask(t.id)}
              className="flex w-full items-center gap-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  t.status === "done" ? "bg-[var(--success)]" : t.status === "in_progress" ? "bg-primary" : "bg-muted-foreground/40",
                )}
              />
              <span className="w-20 shrink-0 text-xs font-bold text-muted-foreground">{t.key}</span>
              <span className={cn("min-w-0 flex-1 truncate", t.status === "done" && "text-muted-foreground line-through")}>
                {t.title}
              </span>
              <span className="text-xs text-muted-foreground">{t.assignee}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sprints() {
  const ordered = [...SPRINTS].sort((a, b) => {
    const order = { active: 0, planned: 1, completed: 2 };
    return order[a.state] - order[b.state];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Спринты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Двухнедельные итерации с целями и прогрессом
        </p>
      </div>
      <div className="space-y-4">
        {ordered.map((s) => (
          <SprintCard key={s.id} sprint={s} />
        ))}
      </div>
    </div>
  );
}
