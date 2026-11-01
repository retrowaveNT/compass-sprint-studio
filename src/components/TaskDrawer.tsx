import { Calendar, MessageSquare, Tag, X } from "lucide-react";
import { useState } from "react";

import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  TEAM,
  useTasks,
  type Status,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export function TaskDrawer() {
  const { selectedTask, closeTask, moveTask, addComment } = useTasks();
  const [comment, setComment] = useState("");

  if (!selectedTask) return null;
  const task = selectedTask;
  const member = TEAM.find((m) => m.name === task.assignee);

  return (
    <>
      <button
        aria-label="Закрыть задачу"
        className="fixed inset-0 z-40 cursor-default bg-black/30"
        onClick={closeTask}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[30rem] flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
            {task.key}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              PRIORITY_STYLES[task.priority],
            )}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <button
            onClick={closeTask}
            aria-label="Закрыть"
            className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <h2 className="text-xl leading-snug font-bold">{task.title}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Статус
              </p>
              <select
                value={task.status}
                onChange={(e) => moveTask(task.id, e.target.value as Status)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Исполнитель
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: member?.color ?? "var(--primary)" }}
                >
                  {member?.initials ?? "?"}
                </span>
                <span className="truncate text-sm">{task.assignee}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              До {task.dueDate}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              {task.tags.join(", ") || "Без меток"}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Описание
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">{task.description}</p>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <MessageSquare className="h-3.5 w-3.5" />
              Комментарии · {task.comments.length}
            </p>
            <div className="space-y-3">
              {task.comments.length === 0 && (
                <p className="text-sm text-muted-foreground">Пока нет комментариев.</p>
              )}
              {task.comments.map((c) => {
                const author = TEAM.find((m) => m.name === c.author);
                return (
                  <div key={c.id} className="flex gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: author?.color ?? "var(--primary)" }}
                    >
                      {author?.initials ?? "?"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{c.author}</span> · {c.time}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim()) {
                  addComment(task.id, comment.trim());
                  setComment("");
                }
              }}
              placeholder="Написать комментарий…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <button
              onClick={() => {
                if (comment.trim()) {
                  addComment(task.id, comment.trim());
                  setComment("");
                }
              }}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Отправить
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
