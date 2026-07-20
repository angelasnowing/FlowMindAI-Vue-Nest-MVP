import type {
  CreateTaskPayload,
  PaginatedResponse,
  PaginationParams,
  Task,
  UpdateTaskPayload,
} from "../types";
import { api } from "./api";

export interface TaskQuery extends PaginationParams {
  goalId?: number;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
}

export const tasksApi = {
  async list(params: TaskQuery = {}) {
    return (await api.get<PaginatedResponse<Task>>("/tasks", { params })).data;
  },
  async get(id: number) {
    return (await api.get<Task>(`/tasks/${id}`)).data;
  },
  async create(payload: CreateTaskPayload) {
    return (await api.post<Task>("/tasks", payload)).data;
  },
  async update(id: number, payload: UpdateTaskPayload) {
    return (await api.patch<Task>(`/tasks/${id}`, payload)).data;
  },
  async remove(id: number) {
    return (await api.delete<{ id: number; deleted: true }>(`/tasks/${id}`))
      .data;
  },
};
