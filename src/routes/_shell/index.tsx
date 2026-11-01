import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, Flame, ListChecks } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { ACTIVITY, PRIORITY_STYLES, PRIORITY_LABELS, SPRINTS, TEAM, useTasks } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/")({
  head: () => ({
    meta: [
      { title: "Обзор — Фокус" },
      { name: "description", content: "Сводка по задачам, спринту и активности команды." },
      { property: "og:title", content: "Обзор — Фокус" },
      { property: "og:description", content: "Сводка по задачам, спринту и активности команды." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const WEEK = [
  { day: "Пн", done: 4 },
  { day: "Вт", done: 6 },
  { day: "Ср", done: 3 },
  { day: "Чт", done: 7 },
  { day: "Пт", done: 5 },
  { day: "Сб", done: 2 },
  { day: "Вс", done: 4 },
];

function Dashboard() {
  const { tasks, openTask } = useTasks();
  const active = tasks.filter((t) => t.status !== "done" && t.status !== "backlog");
  const doneThisSprint = tasks.filter((t) => t.sprintId === "s12" && t.status === "done").length;
  const sprintTasks = tasks.filter((t) => t.sprintId === "s12").length;
  const urgent = active.filter((t) => t.priority === "urgent").length;
  const sprint = SPRINTS.find((s) => s.state === "active")!;
  const myToday = active.filter((t) => t.assignee === "Анна Соколова").slice(0, 4);

  const stats = [
    { label: "Активные задачи", value: active.length, icon: ListChecks, hint: "на доске сейчас" },
    { label: "Выполнено в спринте", value: doneThisSprint, icon: CheckCircle2, hint: `из ${sprintTasks} задач` },
    { label: "Срочных", value: urgent, icon: Flame, hint: "требуют внимания" },
    { label: "До конца спринта", value: "2 дня", icon: Clock, hint: `${sprint.start} — ${sprint.end}` },
  ];

  return (
    <div className="space-y-7">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Добрый день, Анна</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sprint.name}: «{sprint.goal}»
          </p>
        </div>
        <Link
          to="/board"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Перейти к доске <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="font-display mt-3 text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Выполнено за неделю</h2>
            <Link to="/analytics" className="text-xs font-medium text-primary hover:underline">
              Вся аналитика
            </Link>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEK} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="doneFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v} задач`, "Выполнено"]}
                />
                <Area type="monotone" dataKey="done" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#doneFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Активность</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => {
              const member = TEAM.find((m) => m.name === a.who);
              return (
                <div key={i} className="flex gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: member?.color ?? "var(--primary)" }}
                  >
                    {member?.initials ?? "?"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{a.who}</span> {a.what}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.when}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Мои задачи на сегодня</h2>
          <Link to="/board" className="text-xs font-medium text-primary hover:underline">
            Открыть доску
          </Link>
        </div>
        <div className="divide-y divide-border">
          {myToday.map((t) => (
            <button
              key={t.id}
              onClick={() => openTask(t.id)}
              className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <span className="w-20 shrink-0 text-xs font-bold text-muted-foreground">{t.key}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  PRIORITY_STYLES[t.priority],
                )}
              >
                {PRIORITY_LABELS[t.priority]}
              </span>
              <span className="w-20 text-right text-xs text-muted-foreground">до {t.dueDate}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
