import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useTasks, STATUS_LABELS } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Что горит по срокам?",
  "Как дела у спринта 12?",
  "Кому поручить баг с уведомлениями?",
  "Сводка по приоритетам",
];

function buildReply(question: string, tasks: ReturnType<typeof useTasks>["tasks"]): string {
  const q = question.toLowerCase();
  const active = tasks.filter((t) => t.status !== "done");

  if (q.includes("срок") || q.includes("горит") || q.includes("дедлайн")) {
    const urgent = active.filter((t) => t.priority === "urgent" || t.priority === "high");
    if (urgent.length === 0) return "Срочных задач нет — всё под контролем.";
    return `По срокам внимание требуют ${urgent.length} задачи:\n${urgent
      .map((t) => `• ${t.key} «${t.title}» — ${t.assignee}, до ${t.dueDate}`)
      .join("\n")}\nРекомендую начать с FOC-108: она блокирует дашборд у крупных команд.`;
  }
  if (q.includes("спринт")) {
    const inSprint = tasks.filter((t) => t.sprintId === "s12");
    const done = inSprint.filter((t) => t.status === "done").length;
    return `Спринт 12: ${done} из ${inSprint.length} задач завершено (${Math.round((done / inSprint.length) * 100)}%). До конца спринта 2 дня. Главные риски — FOC-108 (производительность дашборда) и FOC-102 (дубли уведомлений), обе в работе у Дмитрия и Игоря.`;
  }
  if (q.includes("поручить") || q.includes("кому") || q.includes("назначить")) {
    return "Для бага с уведомлениями (FOC-102) лучший кандидат — Игорь Панов: он уже в контексте уведомлений и у него 2 задачи в работе против 3 у Дмитрия. Могу предложить переназначить — скажите «назначь Игорю».";
  }
  if (q.includes("приоритет") || q.includes("сводка")) {
    const byP = active.reduce<Record<string, number>>((acc, t) => {
      acc[t.priority] = (acc[t.priority] ?? 0) + 1;
      return acc;
    }, {});
    return `Активных задач: ${active.length}. По приоритетам: срочных — ${byP.urgent ?? 0}, высоких — ${byP.high ?? 0}, средних — ${byP.medium ?? 0}, низких — ${byP.low ?? 0}. Рекомендую не брать в спринт новые задачи, пока не закрыты срочные.`;
  }
  if (q.includes("статус") || q.includes("доска")) {
    const byS = active.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    }, {});
    return `Сейчас на доске: ${Object.entries(byS)
      .map(([s, n]) => `${STATUS_LABELS[s as keyof typeof STATUS_LABELS]} — ${n}`)
      .join(", ")}. Колонка «На проверке» не должна копить больше 3 задач — следите за ревью.`;
  }
  return "Могу помочь со сводкой по задачам, статусом спринта, дедлайнами и распределением нагрузки. Спросите, например: «Что горит по срокам?» или «Как дела у спринта 12?».";
}

export function AiAssistant() {
  const { aiOpen, setAiOpen, tasks } = useTasks();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Привет! Я ИИ-помощник Фокуса. Слежу за задачами, спринтами и сроками — спрашивайте.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, aiOpen]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    const reply = buildReply(trimmed, tasks);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {aiOpen && (
        <button
          aria-label="Закрыть помощника"
          className="fixed inset-0 z-40 cursor-default bg-black/30"
          onClick={() => setAiOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300",
          aiOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold">ИИ-помощник</p>
            <p className="text-xs text-muted-foreground">Анализирует задачи команды</p>
          </div>
          <button
            onClick={() => setAiOpen(false)}
            aria-label="Закрыть"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                Печатает…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Спросите о задачах…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <button
              onClick={() => send(input)}
              aria-label="Отправить"
              className="rounded-lg bg-primary p-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
