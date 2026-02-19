import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, env.JWT_REFRESH_SECRET);
