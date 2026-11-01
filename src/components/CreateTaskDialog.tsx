import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ME,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TEAM,
  useTasks,
  type Priority,
  type Status,
} from "@/lib/store";

export function CreateTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");
  const [assignee, setAssignee] = useState(ME.name);
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) {
      toast.error("Введите название задачи");
      return;
    }
    addTask({
      title: title.trim(),
      description: description.trim() || "Описание пока не заполнено.",
      status,
      priority,
      assignee,
      dueDate: dueDate || "Без срока",
      sprintId: null,
      tags: [],
    });
    toast.success("Задача создана");
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
    onClose();
  };

  return (
    <>
      <button
        aria-label="Закрыть"
        className="fixed inset-0 z-40 cursor-default bg-black/40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 z-50 w-[32rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Новая задача</h2>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Название
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать?"
              autoFocus
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Детали, критерии готовности…"
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Приоритет
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
              >
                {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Исполнитель
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
              >
                {TEAM.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Срок
              </label>
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Например, 5 ноя"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Создать задачу
          </button>
        </div>
      </div>
    </>
  );
}
