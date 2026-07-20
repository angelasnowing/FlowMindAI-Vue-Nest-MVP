export type TabKey = "home" | "plan" | "focus" | "data" | "me";

export interface Task {
  id: number;
  goalId: number;
  title: string;
  estimatedTime: number;
  status: string;
  sortOrder: number;
}

export interface Goal {
  id: number;
  userId: number;
  title: string;
  description: string;
  currentState: string;
  status: string;
  createdAt: string;
  tasks: Task[];
  generationSource?: "ai" | "fallback";
}

export interface FocusRecord {
  id: number;
  userId: number;
  taskId?: number | null;
  duration: number;
  focusScore: number;
  distractionCount: number;
  createdAt: string;
}

export interface FocusStatistics {
  count: number;
  totalDuration: number;
  totalDistractions: number;
  averageDuration: number;
  averageFocusScore: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
}

export interface CreatePlanPayload extends CreateGoalPayload {
  currentState: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export interface CreateTaskPayload {
  goalId: number;
  title: string;
  estimatedTime: number;
  sortOrder?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  estimatedTime?: number;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  sortOrder?: number;
}

export interface CreateFocusRecordPayload {
  taskId?: number;
  duration: number;
  focusScore: number;
  distractionCount: number;
}

export type UpdateFocusRecordPayload = Partial<
  Pick<FocusRecord, "duration" | "focusScore" | "distractionCount">
>;

export interface FlowProfile {
  type: string;
  bestTime: string;
  strength: string;
  weakness: string;
  suggestion: string;
}

export interface DashboardData {
  nickname: string;
  goals: Goal[];
  focusRecords: FocusRecord[];
  profile: FlowProfile | null;
}
