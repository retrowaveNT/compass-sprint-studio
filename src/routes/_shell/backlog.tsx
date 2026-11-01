import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Inbox } from "lucide-react";
import { useMemo, useState } from "react";

import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  TEAM,
  useTasks,
  type Priority,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/backlog")({
  head: () => ({
    meta: [
      { title: "Бэклог — Фокус" },
      { name: "description", content: "Все задачи команды списком: приоритеты, сроки, исполнители." },
      { property: "og:title", content: "Бэклог — Фокус" },
      { property: "og:description", content: "Все задачи команды списком: приоритеты, сроки, исполнители." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Backlog,
});

const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
const FILTERS = ["all", "backlog", "todo", "in_progress", "review", "done"] as const;

function Backlog() {
  const { tasks, openTask } = useTasks();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [sortByPriority, setSortByPriority] = useState(false);

  const visible = useMemo(() => {
    let list = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
    if (sortByPriority) {
      list = [...list].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }
    return list;
  }, [tasks, filter, sortByPriority]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Бэклог</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {visible.length} задач · сортировка и фильтры
          </p>
        </div>
        <button
          onClick={() => setSortByPriority((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            sortByPriority
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-input text-muted-foreground hover:bg-muted",
          )}
        >
          <ArrowUpDown className="h-4 w-4" />
          По приоритету
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent",
            )}
          >
            {f === "all" ? "Все" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 font-semibold">Ключ</th>
              <th className="px-5 py-3 font-semibold">Задача</th>
              <th className="px-5 py-3 font-semibold">Статус</th>
              <th className="px-5 py-3 font-semibold">Приоритет</th>
              <th className="px-5 py-3 font-semibold">Исполнитель</th>
              <th className="px-5 py-3 text-right font-semibold">Срок</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((t) => {
              const member = TEAM.find((m) => m.name === t.assignee);
              return (
                <tr
                  key={t.id}
                  onClick={() => openTask(t.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <td className="px-5 py-3.5 font-bold text-muted-foreground">{t.key}</td>
                  <td className="max-w-72 px-5 py-3.5">
                    <p className="truncate font-medium">{t.title}</p>
                    {t.tags.length > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.tags.join(" · ")}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{STATUS_LABELS[t.status]}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        PRIORITY_STYLES[t.priority],
                      )}
                    >
                      {PRIORITY_LABELS[t.priority]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: member?.color ?? "var(--primary)" }}
                      >
                        {member?.initials ?? "?"}
                      </span>
                      <span className="hidden lg:inline">{t.assignee}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">{t.dueDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">В этом фильтре задач нет</p>
          </div>
        )}
      </div>
    </div>
  );
}
