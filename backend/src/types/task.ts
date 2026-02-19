export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
