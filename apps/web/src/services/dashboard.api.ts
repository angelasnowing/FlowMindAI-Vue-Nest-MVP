import type { DashboardData } from "../types";
import { api } from "./api";

export const dashboardApi = {
  async get() {
    return (await api.get<DashboardData>("/dashboard")).data;
  },
};
