import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Crosshair,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Timer,
} from "lucide-react";
import { useState } from "react";

import { useTasks, useTheme, TEAM } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AiAssistant } from "@/components/AiAssistant";
import { TaskDrawer } from "@/components/TaskDrawer";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";

const NAV = [
  { to: "/", label: "Обзор", icon: LayoutDashboard },
  { to: "/board", label: "Доска", icon: KanbanSquare },
  { to: "/backlog", label: "Бэклог", icon: Inbox },
  { to: "/sprints", label: "Спринты", icon: Timer },
  { to: "/analytics", label: "Аналитика", icon: BarChart3 },
  { to: "/settings", label: "Настройки", icon: Settings },
] as const;

export function AppShell() {
  const { dark, toggle } = useTheme();
  const { setAiOpen, tasks } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const path = routerState.location.pathname;

  const activeCount = tasks.filter((t) => t.status !== "done" && t.status !== "backlog").length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-card">
        <Link to="/" className="flex items-center gap-2.5 px-5 pt-6 pb-7">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Crosshair className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Фокус</span>
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {item.to === "/board" && (
                  <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    {activeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <button
            onClick={() => setAiOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
          >
            <Sparkles className="h-4 w-4" />
            ИИ-помощник
          </button>
          <div className="flex items-center gap-3 px-1">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: TEAM[0].color }}
            >
              {TEAM[0].initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{TEAM[0].name}</p>
              <p className="truncate text-xs text-muted-foreground">Владелец продукта</p>
            </div>
            <button
              onClick={toggle}
              aria-label="Переключить тему"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/80 px-8 py-3.5 backdrop-blur">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Поиск по задачам…"
              className="w-full rounded-lg border border-input bg-card py-2 pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate({ to: "/backlog" });
              }}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Новая задача
            </button>
          </div>
        </header>

        <main className="flex-1 px-8 py-7">
          <Outlet />
        </main>
      </div>

      <AiAssistant />
      <TaskDrawer />
      <CreateTaskDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
