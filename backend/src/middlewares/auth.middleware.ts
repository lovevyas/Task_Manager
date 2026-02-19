import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(token) as Request["user"];
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
