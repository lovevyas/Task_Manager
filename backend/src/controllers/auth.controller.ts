import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { loginUser, refreshAuthToken, registerUser, revokeRefreshToken } from "../services/auth.service";

const refreshCookieConfig = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body.name, req.body.email, req.body.password);
  res.cookie("refreshToken", result.refreshToken, refreshCookieConfig);
  return res.status(StatusCodes.CREATED).json({ user: result.user, accessToken: result.accessToken });
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.cookie("refreshToken", result.refreshToken, refreshCookieConfig);
  return res.status(StatusCodes.OK).json({ user: result.user, accessToken: result.accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Missing refresh token" });
  }

  const result = await refreshAuthToken(token);
  res.cookie("refreshToken", result.refreshToken, refreshCookieConfig);
  return res.status(StatusCodes.OK).json({ accessToken: result.accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    await revokeRefreshToken(token);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.status(StatusCodes.NO_CONTENT).send();
};
