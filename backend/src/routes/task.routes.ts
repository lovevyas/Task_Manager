import { Router } from "express";
import { z } from "zod";
import { rewriteTitle } from "../controllers/ai.controller";
import { getTask, getTasks, patchTask, postTask, removeTask, toggleTask } from "../controllers/task.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { TASK_STATUSES } from "../types/task";

const router = Router();

const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(50).optional(),
    status: z.enum(TASK_STATUSES).optional(),
    search: z.string().trim().max(150).optional()
  })
});

const baseTaskSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(500).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.enum(TASK_STATUSES).optional()
});

const createSchema = z.object({ body: baseTaskSchema.omit({ status: true }) });
const updateSchema = z.object({ body: baseTaskSchema.partial() });
const idSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const aiRewriteSchema = z.object({ body: z.object({ rawTitle: z.string().trim().min(2).max(120) }) });

router.use(requireAuth);
router.get("/", validate(listSchema), asyncHandler(getTasks));
router.post("/", validate(createSchema), asyncHandler(postTask));
router.get("/:id", validate(idSchema), asyncHandler(getTask));
router.patch("/:id", validate(updateSchema), asyncHandler(patchTask));
router.delete("/:id", validate(idSchema), asyncHandler(removeTask));
router.patch("/:id/toggle", validate(idSchema), asyncHandler(toggleTask));
router.post("/ai/rewrite", validate(aiRewriteSchema), asyncHandler(rewriteTitle));

export default router;
