export type User = {
  id: string;
  name: string;
  email: string;
};

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedTasks = {
  items: Task[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
