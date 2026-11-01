import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Status = "backlog" | "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  sprintId: string | null;
  tags: string[];
  comments: Comment[];
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  start: string;
  end: string;
  state: "active" | "planned" | "completed";
}

export const STATUS_LABELS: Record<Status, string> = {
  backlog: "Бэклог",
  todo: "К выполнению",
  in_progress: "В работе",
  review: "На проверке",
  done: "Готово",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  urgent: "Срочный",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-accent text-accent-foreground",
  high: "bg-[color-mix(in_oklch,var(--warning)_18%,transparent)] text-[var(--warning)]",
  urgent:
    "bg-[color-mix(in_oklch,var(--destructive)_14%,transparent)] text-[var(--destructive)]",
};

export const TEAM = [
  { name: "Анна Соколова", initials: "АС", color: "oklch(0.64 0.2 283.5)" },
  { name: "Дмитрий Орлов", initials: "ДО", color: "oklch(0.65 0.17 155)" },
  { name: "Мария Ким", initials: "МК", color: "oklch(0.68 0.18 330)" },
  { name: "Игорь Панов", initials: "ИП", color: "oklch(0.72 0.15 75)" },
];

export const ME = TEAM[0]!;

export const SPRINTS: Sprint[] = [
  {
    id: "s12",
    name: "Спринт 12",
    goal: "Запустить новую доску и стабилизировать уведомления",
    start: "20 окт",
    end: "2 ноя",
    state: "active",
  },
  {
    id: "s13",
    name: "Спринт 13",
    goal: "Мобильная адаптация и офлайн-режим",
    start: "3 ноя",
    end: "16 ноя",
    state: "planned",
  },
  {
    id: "s11",
    name: "Спринт 11",
    goal: "Интеграция календаря и отчётов",
    start: "6 окт",
    end: "19 окт",
    state: "completed",
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    key: "FOC-101",
    title: "Редизайн карточки задачи",
    description:
      "Обновить карточку задачи: добавить чек-лист, вложения и историю изменений. Сохранить текущую плотность интерфейса.",
    status: "in_progress",
    priority: "high",
    assignee: "Анна Соколова",
    dueDate: "30 окт",
    sprintId: "s12",
    tags: ["Дизайн"],
    comments: [
      {
        id: "c1",
        author: "Дмитрий Орлов",
        text: "Макеты готовы, жду ревью по чек-листу.",
        time: "вчера, 17:42",
      },
    ],
  },
  {
    id: "t2",
    key: "FOC-102",
    title: "Починить дубли уведомлений",
    description:
      "При переносе задачи между колонками пользователю приходят два одинаковых пуш-уведомления.",
    status: "todo",
    priority: "urgent",
    assignee: "Игорь Панов",
    dueDate: "29 окт",
    sprintId: "s12",
    tags: ["Баг", "Разработка"],
    comments: [],
  },
  {
    id: "t3",
    key: "FOC-103",
    title: "Настроить аналитику воронки",
    description:
      "Собрать события регистрации и активации, вывести воронку на дашборд аналитики.",
    status: "review",
    priority: "medium",
    assignee: "Мария Ким",
    dueDate: "31 окт",
    sprintId: "s12",
    tags: ["Аналитика"],
    comments: [
      {
        id: "c2",
        author: "Анна Соколова",
        text: "Проверила на тестовых данных — цифры сходятся.",
        time: "сегодня, 10:15",
      },
    ],
  },
  {
    id: "t4",
    key: "FOC-104",
    title: "Экран онбординга для новых команд",
    description:
      "Три шага: создать проект, пригласить команду, завести первую задачу.",
    status: "done",
    priority: "medium",
    assignee: "Анна Соколова",
    dueDate: "24 окт",
    sprintId: "s12",
    tags: ["Дизайн", "Разработка"],
    comments: [],
  },
  {
    id: "t5",
    key: "FOC-105",
    title: "API для интеграции с календарём",
    description:
      "REST-эндпоинты для двусторонней синхронизации дедлайнов с внешними календарями.",
    status: "in_progress",
    priority: "high",
    assignee: "Дмитрий Орлов",
    dueDate: "1 ноя",
    sprintId: "s12",
    tags: ["Разработка"],
    comments: [],
  },
  {
    id: "t6",
    key: "FOC-106",
    title: "Тёмная тема: контраст бейджей",
    description:
      "Проверить контраст всех бейджей приоритета в тёмной теме по WCAG AA.",
    status: "todo",
    priority: "low",
    assignee: "Мария Ким",
    dueDate: "2 ноя",
    sprintId: "s12",
    tags: ["Дизайн"],
    comments: [],
  },
  {
    id: "t7",
    key: "FOC-107",
    title: "Рассылка о запуске доски",
    description:
      "Подготовить письмо пользователям о новой канбан-доске и собрать сегмент.",
    status: "review",
    priority: "medium",
    assignee: "Игорь Панов",
    dueDate: "30 окт",
    sprintId: "s12",
    tags: ["Маркетинг"],
    comments: [],
  },
  {
    id: "t8",
    key: "FOC-108",
    title: "Замедление загрузки дашборда",
    description:
      "Дашборд грузится 4+ секунды у команд с 500+ задачами. Нужна пагинация и кэш.",
    status: "in_progress",
    priority: "urgent",
    assignee: "Дмитрий Орлов",
    dueDate: "29 окт",
    sprintId: "s12",
    tags: ["Баг", "Разработка"],
    comments: [
      {
        id: "c3",
        author: "Игорь Панов",
        text: "Профилирование показало узкое место в запросе активности.",
        time: "вчера, 12:03",
      },
    ],
  },
  {
    id: "t9",
    key: "FOC-109",
    title: "Мобильная версия доски",
    description: "Адаптировать канбан под экраны до 390px: свайп между колонками.",
    status: "backlog",
    priority: "high",
    assignee: "Анна Соколова",
    dueDate: "12 ноя",
    sprintId: "s13",
    tags: ["Разработка"],
    comments: [],
  },
  {
    id: "t10",
    key: "FOC-110",
    title: "Офлайн-режим для задач",
    description:
      "Кэшировать задачи локально и синхронизировать при появлении сети.",
    status: "backlog",
    priority: "medium",
    assignee: "Дмитрий Орлов",
    dueDate: "14 ноя",
    sprintId: "s13",
    tags: ["Разработка"],
    comments: [],
  },
  {
    id: "t11",
    key: "FOC-111",
    title: "Шаблоны задач",
    description:
      "Библиотека шаблонов: баг-репорт, релиз, исследование. Быстрое создание в один клик.",
    status: "backlog",
    priority: "low",
    assignee: "Мария Ким",
    dueDate: "15 ноя",
    sprintId: null,
    tags: ["Продукт"],
    comments: [],
  },
  {
    id: "t12",
    key: "FOC-112",
    title: "Экспорт отчёта в PDF",
    description: "Выгрузка аналитики спринта в PDF для статус-встреч.",
    status: "backlog",
    priority: "medium",
    assignee: "Игорь Панов",
    dueDate: "10 ноя",
    sprintId: "s13",
    tags: ["Аналитика"],
    comments: [],
  },
  {
    id: "t13",
    key: "FOC-113",
    title: "Интеграция с репозиторием",
    description:
      "Автоматически привязывать коммиты и пул-реквесты к задачам по ключу.",
    status: "done",
    priority: "high",
    assignee: "Дмитрий Орлов",
    dueDate: "18 окт",
    sprintId: "s11",
    tags: ["Разработка"],
    comments: [],
  },
  {
    id: "t14",
    key: "FOC-114",
    title: "Метрики скорости команды",
    description: "Velocity-график по последним шести спринтам.",
    status: "done",
    priority: "medium",
    assignee: "Мария Ким",
    dueDate: "17 окт",
    sprintId: "s11",
    tags: ["Аналитика"],
    comments: [],
  },
  {
    id: "t15",
    key: "FOC-115",
    title: "Обновить страницу тарифов",
    description: "Новые планы и сравнение возможностей.",
    status: "done",
    priority: "low",
    assignee: "Игорь Панов",
    dueDate: "15 окт",
    sprintId: "s11",
    tags: ["Маркетинг"],
    comments: [],
  },
];

export const ACTIVITY = [
  { who: "Дмитрий Орлов", what: "перенёс FOC-108 в «В работе»", when: "12 мин назад" },
  { who: "Анна Соколова", what: "оставила комментарий в FOC-103", when: "34 мин назад" },
  { who: "Мария Ким", what: "создала задачу FOC-112", when: "1 ч назад" },
  { who: "Игорь Панов", what: "завершил FOC-115", when: "вчера, 18:20" },
  { who: "Анна Соколова", what: "обновила цель спринта 12", when: "вчера, 11:05" },
];

interface TasksContextValue {
  tasks: Task[];
  moveTask: (id: string, status: Status) => void;
  addTask: (task: Omit<Task, "id" | "key" | "comments">) => void;
  addComment: (taskId: string, text: string) => void;
  selectedTask: Task | null;
  openTask: (id: string) => void;
  closeTask: () => void;
  aiOpen: boolean;
  setAiOpen: (open: boolean) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const moveTask = useCallback((id: string, status: Status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "key" | "comments">) => {
    setTasks((prev) => [
      {
        ...task,
        id: `t${Date.now()}`,
        key: `FOC-${116 + prev.length}`,
        comments: [],
      },
      ...prev,
    ]);
  }, []);

  const addComment = useCallback((taskId: string, text: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `c${Date.now()}`,
                  author: "Анна Соколова",
                  text,
                  time: "только что",
                },
              ],
            }
          : t,
      ),
    );
  }, []);

  const openTask = useCallback((id: string) => setSelectedId(id), []);
  const closeTask = useCallback(() => setSelectedId(null), []);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      moveTask,
      addTask,
      addComment,
      selectedTask: tasks.find((t) => t.id === selectedId) ?? null,
      openTask,
      closeTask,
      aiOpen,
      setAiOpen,
    }),
    [tasks, moveTask, addTask, addComment, selectedId, openTask, closeTask, aiOpen],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

export function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("focus-theme", next ? "dark" : "light");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { dark, toggle };
}
