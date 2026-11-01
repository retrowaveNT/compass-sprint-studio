import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PRIORITY_LABELS, STATUS_LABELS, useTasks, type Priority, type Status } from "@/lib/store";

export const Route = createFileRoute("/_shell/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика — Фокус" },
      { name: "description", content: "Скорость команды, распределение задач и выводы ИИ." },
      { property: "og:title", content: "Аналитика — Фокус" },
      { property: "og:description", content: "Скорость команды, распределение задач и выводы ИИ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Analytics,
});

const VELOCITY = [
  { sprint: "С7", points: 21 },
  { sprint: "С8", points: 26 },
  { sprint: "С9", points: 19 },
  { sprint: "С10", points: 30 },
  { sprint: "С11", points: 28 },
  { sprint: "С12", points: 24 },
];

const BURNDOWN = [
  { day: "Д1", left: 34 },
  { day: "Д2", left: 31 },
  { day: "Д3", left: 28 },
  { day: "Д4", left: 24 },
  { day: "Д5", left: 22 },
  { day: "Д6", left: 17 },
  { day: "Д7", left: 14 },
  { day: "Д8", left: 10 },
  { day: "Д9", left: 7 },
  { day: "Д10", left: 4 },
];

const STATUS_COLORS: Record<Status, string> = {
  backlog: "var(--chart-5)",
  todo: "var(--chart-3)",
  in_progress: "var(--chart-1)",
  review: "var(--chart-4)",
  done: "var(--chart-2)",
};

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

function Analytics() {
  const { tasks, setAiOpen } = useTasks();

  const byStatus = (Object.keys(STATUS_LABELS) as Status[])
    .map((s) => ({
      name: STATUS_LABELS[s],
      value: tasks.filter((t) => t.status === s).length,
      color: STATUS_COLORS[s],
    }))
    .filter((d) => d.value > 0);

  const byPriority = (Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => ({
    name: PRIORITY_LABELS[p],
    count: tasks.filter((t) => t.priority === p).length,
  }));

  const doneTotal = tasks.filter((t) => t.status === "done").length;
  const pct = Math.round((doneTotal / tasks.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Скорость команды и распределение задач
          </p>
        </div>
        <button
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15"
        >
          <Sparkles className="h-4 w-4" />
          Спросить ИИ о цифрах
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Завершено задач", value: `${doneTotal} из ${tasks.length}` },
          { label: "Доля выполнения", value: `${pct}%` },
          { label: "Средний velocity", value: "24.7 очков" },
          { label: "Прогноз спринта", value: "успеем" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Velocity по спринтам
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">Очки историй за последние 6 спринтов</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VELOCITY} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="sprint" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} formatter={(v) => [`${v} очков`, "Velocity"]} />
                <Bar dataKey="points" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 font-semibold">Сгорание спринта 12</h2>
          <p className="mb-4 text-xs text-muted-foreground">Оставшиеся очки по дням спринта</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BURNDOWN} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip cursor={{ stroke: "var(--border)" }} contentStyle={tooltipStyle} formatter={(v) => [`${v} очков`, "Осталось"]} />
                <Line type="monotone" dataKey="left" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 font-semibold">Задачи по статусам</h2>
          <p className="mb-4 text-xs text-muted-foreground">Все задачи команды</p>
          <div className="flex h-56 items-center">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {byStatus.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {byStatus.map((d) => (
                <div key={d.name} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="flex-1 text-muted-foreground">{d.name}</span>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 font-semibold">Задачи по приоритетам</h2>
          <p className="mb-4 text-xs text-muted-foreground">Распределение нагрузки</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" width={70} />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} formatter={(v) => [`${v} задач`, "Количество"]} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          Выводы ИИ-помощника
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>• Velocity стабилен (24–30 очков), но спринт 12 идёт ниже среднего — не добавляйте новые задачи до демо.</li>
          <li>• Две срочные задачи (FOC-102, FOC-108) висят на двух людях — это главный риск спринта.</li>
          <li>• Колонка «На проверке» растёт медленнее обычного: ревью идёт вовремя, так держать.</li>
        </ul>
      </div>
    </div>
  );
}
