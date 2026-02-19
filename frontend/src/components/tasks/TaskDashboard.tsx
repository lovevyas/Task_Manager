"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createTask, deleteTask, fetchTasks, rewriteTaskTitle, toggleTask, updateTask } from "@/lib/api/tasks";
import { Task } from "@/types";
import { Button } from "../ui/Button";

type BurstPiece = { id: number; left: string; delay: string; emoji: string };

const CONFETTI = ["🎉", "✨", "🎊", "💫", "⭐"];

export const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);
  const [burstTaskId, setBurstTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const trimmedSearch = useMemo(() => search.trim(), [search]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks({ page, pageSize: 8, status: status || undefined, search: trimmedSearch || undefined });
      setTasks(data.items);
      setTotalPages(data.pagination.totalPages || 1);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, status]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      loadTasks();
    }, 300);
    return () => clearTimeout(id);
  }, [trimmedSearch]);

  const onCreate = async () => {
    if (!title.trim()) return;

    try {
      await createTask({ title: title.trim() });
      setTitle("");
      toast.success("Task created");
      loadTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const onSaveEdit = async () => {
    if (!editing || !editing.title.trim()) return;
    try {
      await updateTask(editing.id, { title: editing.title.trim() });
      setEditing(null);
      toast.success("Task updated");
      loadTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const getStatusTone = (task: Task) =>
    task.status === "DONE"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-slate-100 text-slate-700 border border-slate-200";

  const getToggleConfig = (task: Task) =>
    task.status === "DONE"
      ? { label: "Pending", className: "bg-rose-600 hover:bg-rose-700" }
      : { label: "Done", className: "bg-emerald-600 hover:bg-emerald-700" };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = await toggleTask(task.id);
      if (updatedTask.status === "DONE") {
        setBurstTaskId(task.id);
        toast.success("Great job! Task completed 🎉");
        setTimeout(() => setBurstTaskId((id) => (id === task.id ? null : id)), 1000);
      }
      loadTasks();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const confettiPieces: BurstPiece[] = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.35}s`,
        emoji: CONFETTI[i % CONFETTI.length]
      })),
    [burstTaskId]
  );

  return (
    <div className="space-y-4">
      <style>{`@keyframes confetti-fall {0%{transform:translateY(-12px) scale(1);opacity:1;}100%{transform:translateY(70px) scale(.9);opacity:0;}}`}</style>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="w-full rounded-lg border p-2" placeholder="Add task" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={onCreate}>Add</Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={async () => {
              if (!title.trim()) return;
              try {
                const rewritten = await rewriteTaskTitle(title);
                setTitle(rewritten.suggestion);
              } catch {
                toast.error("AI rewrite unavailable");
              }
            }}
          >
            AI Rewrite
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <input className="rounded-lg border p-2" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          className="rounded-lg border p-2"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="rounded bg-slate-100 px-2 py-1">Total: {totalTasks}</span>
          <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-700">Completed: {completedTasks}</span>
          <span className="font-medium">Progress: {progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="grid gap-3">
        {loading && Array.from({ length: 4 }).map((_, idx) => <div key={`skeleton-${idx}`} className="h-24 animate-pulse rounded-xl bg-slate-200" />)}

        {!loading &&
          tasks.map((task) => {
            const toggleConfig = getToggleConfig(task);
            return (
              <div
                key={task.id}
                className={`relative flex items-center justify-between rounded-xl p-4 shadow-sm transition ${
                  task.status === "DONE" ? "bg-emerald-50" : "bg-white"
                }`}
              >
                {burstTaskId === task.id && (
                  <div className="pointer-events-none absolute inset-x-0 top-2 h-16 overflow-hidden">
                    {confettiPieces.map((piece) => (
                      <span
                        key={piece.id}
                        className="absolute text-sm"
                        style={{
                          left: piece.left,
                          top: 0,
                          animation: `confetti-fall 900ms ease-out ${piece.delay} forwards`
                        }}
                      >
                        {piece.emoji}
                      </span>
                    ))}
                  </div>
                )}

                <div className="w-full">
                  {editing?.id === task.id ? (
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded-lg border p-2"
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      />
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onSaveEdit}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className={`font-medium ${task.status === "DONE" ? "text-emerald-800 line-through" : "text-slate-900"}`}>{task.title}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium transition hover:brightness-95 ${getStatusTone(task)}`}
                        title="Click to toggle status"
                      >
                        {task.status}
                      </button>
                    </>
                  )}
                </div>
                {editing?.id !== task.id && (
                  <div className="ml-4 flex gap-2">
                    <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setEditing({ id: task.id, title: task.title })}>
                      Edit
                    </Button>
                    <Button onClick={() => handleToggleTask(task)} className={toggleConfig.className}>
                      {toggleConfig.label}
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          await deleteTask(task.id);
                          toast.success("Task deleted");
                          loadTasks();
                        } catch {
                          toast.error("Failed to delete task");
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex items-center justify-between">
        <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};
