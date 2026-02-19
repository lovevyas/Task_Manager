import { PaginatedTasks, Task, TaskStatus } from "@/types";
import { api } from "./client";

export const fetchTasks = async (params: { page: number; pageSize: number; status?: TaskStatus; search?: string }) => {
  const { data } = await api.get<PaginatedTasks>("/tasks", { params });
  return data;
};

export const createTask = async (payload: { title: string; description?: string }) => {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
};

export const updateTask = async (
  id: string,
  payload: Partial<{ title: string; description: string | null; dueDate: string | null; status: TaskStatus }>
) => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};

export const toggleTask = async (id: string) => {
  const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
  return data;
};

export const rewriteTaskTitle = async (raw: string) => {
  const { data } = await api.post<{ suggestion: string }>("/tasks/ai/rewrite", { rawTitle: raw });
  return data;
};
