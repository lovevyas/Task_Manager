import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation failed", issues: err.issues });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2021") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Database schema is not up to date. Run: npx prisma migrate dev"
      });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Database error. Ensure Prisma migrations are applied."
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
};
