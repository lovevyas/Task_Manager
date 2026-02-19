import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { rewriteTaskTitle } from "../services/ai.service";

export const rewriteTitle = async (req: Request, res: Response) => {
  const suggestion = await rewriteTaskTitle(req.body.rawTitle);
  return res.status(StatusCodes.OK).json({ suggestion });
};
