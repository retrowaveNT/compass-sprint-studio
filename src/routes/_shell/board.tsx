import { createFileRoute } from "@tanstack/react-router";
import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";

import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  TEAM,
  useTasks,
  type Status,
  type Task,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/board")({
  head: () => ({
    meta: [
      { title: "Доска — Фокус" },
      { name: "description", content: "Канбан-доска команды: перетаскивайте задачи между колонками." },
      { property: "og:title", content: "Доска — Фокус" },
      { property: "og:description", content: "Канбан-доска команды: перетаскивайте задачи между колонками." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Board,
});

const COLUMNS: Status[] = ["todo", "in_progress", "review", "done"];

function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const member = TEAM.find((m) => m.name === task.assignee);
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/task-id", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onOpen}
      className="group cursor-grab rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground">{task.key}</span>
        <GripVertical className="ml-auto h-4 w-4 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="text-sm leading-snug font-semibold">{task.title}</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            PRIORITY_STYLES[task.priority],
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.tags.slice(0, 1).map((tag) => (
          <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {tag}
          </span>
        ))}
        <span
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: member?.color ?? "var(--primary)" }}
          title={task.assignee}
        >
          {member?.initials ?? "?"}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">до {task.dueDate}</p>
    </div>
  );
}

function Board() {
  const { tasks, moveTask, openTask } = useTasks();
  const [dragOver, setDragOver] = useState<Status | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Доска</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Спринт 12 · перетаскивайте карточки между колонками
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(status);
              }}
              onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/task-id");
                if (id) moveTask(id, status);
                setDragOver(null);
              }}
              className={cn(
                "flex min-h-40 flex-col rounded-xl border border-dashed p-3 transition-colors",
                dragOver === status
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/50",
              )}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <h2 className="text-sm font-bold">{STATUS_LABELS[status]}</h2>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {columnTasks.length}
                </span>
                <button
                  aria-label="Добавить задачу"
                  className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {columnTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onOpen={() => openTask(t.id)} />
                ))}
                {columnTasks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    Перетащите задачу сюда
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
