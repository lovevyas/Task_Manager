import { Prisma } from "@prisma/client";
import { TaskStatus } from "../types/task";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

type TaskFilters = {
  page: number;
  pageSize: number;
  status?: TaskStatus;
  search?: string;
};

type TaskPayload = {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
};

export const listTasks = async (userId: string, filters: TaskFilters) => {
  const where: Prisma.TaskWhereInput = {
    userId,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          title: {
            contains: filters.search          
          }
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize
    }),
    prisma.task.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / filters.pageSize))
    }
  };
};

const mapTaskPayload = (data: TaskPayload) => ({
  ...data,
  ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {})
});

export const createTask = async (userId: string, data: { title: string; description?: string | null; dueDate?: string | null }) =>
  prisma.task.create({
    data: {
      userId,
      ...mapTaskPayload(data)
    }
  });

export const getTaskById = async (userId: string, id: string) => {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Task not found");
  }
  return task;
};

export const updateTask = async (userId: string, id: string, data: TaskPayload) => {
  await getTaskById(userId, id);
  return prisma.task.update({
    where: { id },
    data: mapTaskPayload(data)
  });
};

export const deleteTask = async (userId: string, id: string) => {
  await getTaskById(userId, id);
  await prisma.task.delete({ where: { id } });
};

export const toggleTaskStatus = async (userId: string, id: string) => {
  const task = await getTaskById(userId, id);
  const nextStatus = task.status === "DONE" ? "PENDING" : "DONE";
  return prisma.task.update({ where: { id }, data: { status: nextStatus } });
};
