import type {
  CreateGoalPayload,
  CreatePlanPayload,
  Goal,
  PaginatedResponse,
  PaginationParams,
  UpdateGoalPayload,
} from "../types";
import { api } from "./api";

export interface GoalQuery extends PaginationParams {
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export const goalsApi = {
  async list(params: GoalQuery = {}) {
    return (await api.get<PaginatedResponse<Goal>>("/goals", { params })).data;
  },
  async get(id: number) {
    return (await api.get<Goal>(`/goals/${id}`)).data;
  },
  async create(payload: CreateGoalPayload) {
    return (await api.post<Goal>("/goals", payload)).data;
  },
  async createPlan(payload: CreatePlanPayload) {
    return (await api.post<Goal>("/plans", payload)).data;
  },
  async update(id: number, payload: UpdateGoalPayload) {
    return (await api.patch<Goal>(`/goals/${id}`, payload)).data;
  },
  async remove(id: number) {
    return (await api.delete<{ id: number; deleted: true }>(`/goals/${id}`))
      .data;
  },
};
