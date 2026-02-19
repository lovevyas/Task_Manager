import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  toggleTaskStatus,
  updateTask
} from "../services/task.service";

export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const result = await listTasks(userId, {
    page: (req.query.page as number | undefined) ?? 1,
    pageSize: (req.query.pageSize as number | undefined) ?? 10,
    status: req.query.status as "PENDING" | "IN_PROGRESS" | "DONE" | undefined,
    search: req.query.search as string | undefined
  });

  return res.status(StatusCodes.OK).json(result);
};

export const postTask = async (req: Request, res: Response) => {
  const task = await createTask(req.user!.sub, req.body);
  return res.status(StatusCodes.CREATED).json(task);
};

export const getTask = async (req: Request, res: Response) => {
  const task = await getTaskById(req.user!.sub, req.params.id);
  return res.status(StatusCodes.OK).json(task);
};

export const patchTask = async (req: Request, res: Response) => {
  const task = await updateTask(req.user!.sub, req.params.id, req.body);
  return res.status(StatusCodes.OK).json(task);
};

export const removeTask = async (req: Request, res: Response) => {
  await deleteTask(req.user!.sub, req.params.id);
  return res.status(StatusCodes.NO_CONTENT).send();
};

export const toggleTask = async (req: Request, res: Response) => {
  const task = await toggleTaskStatus(req.user!.sub, req.params.id);
  return res.status(StatusCodes.OK).json(task);
};
