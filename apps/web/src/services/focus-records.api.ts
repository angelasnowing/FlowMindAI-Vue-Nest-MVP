import type {
  CreateFocusRecordPayload,
  FocusRecord,
  FocusStatistics,
  PaginatedResponse,
  PaginationParams,
  UpdateFocusRecordPayload,
} from "../types";
import { api } from "./api";

export interface FocusRecordQuery extends PaginationParams {
  taskId?: number;
}

export const focusRecordsApi = {
  async list(params: FocusRecordQuery = {}) {
    return (
      await api.get<PaginatedResponse<FocusRecord>>("/focus-records", {
        params,
      })
    ).data;
  },
  async statistics() {
    return (await api.get<FocusStatistics>("/focus-records/statistics")).data;
  },
  async get(id: number) {
    return (await api.get<FocusRecord>(`/focus-records/${id}`)).data;
  },
  async create(payload: CreateFocusRecordPayload) {
    return (await api.post<FocusRecord>("/focus-records", payload)).data;
  },
  async update(id: number, payload: UpdateFocusRecordPayload) {
    return (await api.patch<FocusRecord>(`/focus-records/${id}`, payload)).data;
  },
  async remove(id: number) {
    return (
      await api.delete<{ id: number; deleted: true }>(`/focus-records/${id}`)
    ).data;
  },
};
