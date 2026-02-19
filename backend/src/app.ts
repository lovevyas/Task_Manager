import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorMiddleware);
