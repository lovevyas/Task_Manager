import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { HttpError } from "../utils/httpError";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const issueTokens = async (userId: string) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS)
    }
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true }
  });

  const tokens = await issueTokens(user.id);
  return { user, ...tokens };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const tokens = await issueTokens(user.id);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...tokens
  };
};

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken) as { sub: string };
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.userId !== payload.sub || stored.expiresAt < new Date()) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    return issueTokens(payload.sub);
  } catch {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }
};

export const revokeRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) return;
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};
