<template>
  <div class="app-shell">
    <AppSidebar v-model="tab" />
    <PwaStatus />
    <main>
      <AppHeader :tab="tab" :nickname="data?.nickname" />
      <HomeView
        v-if="tab === 'home'"
        v-model:goal-input="goalInput"
        v-model:mood="mood"
        :loading="loading"
        :error-message="planError"
        @create-plan="createPlan"
      />
      <PlanView
        v-else-if="tab === 'plan'"
        :goal="goal"
        :tasks="tasks"
        @start-focus="startFocus"
        @update-task-status="updateTaskStatus"
      />
      <FocusView
        v-else-if="tab === 'focus'"
        :selected="selected"
        :fallback-task="tasks[0]"
        :time="time"
        :progress="progress"
        :seconds="seconds"
        :running="running"
        :finished="finished"
        :focus-count="data?.focusRecords.length ?? 0"
        @toggle-running="running = !running"
        @complete="completeFocus"
      />
      <DataView
        v-else-if="tab === 'data'"
        :profile="data?.profile"
        :statistics="statistics"
      />
      <ProfileView v-else :nickname="data?.nickname" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
import PwaStatus from "./components/PwaStatus.vue";
import { dashboardApi } from "./services/dashboard.api";
import { getApiErrorMessage } from "./services/api";
import { focusRecordsApi } from "./services/focus-records.api";
import { goalsApi } from "./services/goals.api";
import { tasksApi } from "./services/tasks.api";
import DataView from "./views/DataView.vue";
import FocusView from "./views/FocusView.vue";
import HomeView from "./views/HomeView.vue";
import PlanView from "./views/PlanView.vue";
import ProfileView from "./views/ProfileView.vue";
import type { DashboardData, FocusStatistics, Task, TabKey } from "./types";

const tab = ref<TabKey>("home");
const data = ref<DashboardData | null>(null);
const goalInput = ref("我想在1个月内学习5种国际象棋开局方式");
const mood = ref("目标清晰");
const loading = ref(false);
const planError = ref("");
const selected = ref<Task | null>(null);
const seconds = ref(1500);
const running = ref(false);
const finished = ref(false);
const statistics = ref<FocusStatistics>({
  count: 0,
  totalDuration: 0,
  totalDistractions: 0,
  averageDuration: 0,
  averageFocusScore: 0,
});
let timer: number | undefined;

const goal = computed(() => data.value?.goals?.[0]);
const tasks = computed(() => goal.value?.tasks ?? []);
const time = computed(
  () =>
    `${String(Math.floor(seconds.value / 60)).padStart(2, "0")}:${String(seconds.value % 60).padStart(2, "0")}`,
);
const progress = computed(() => ((1500 - seconds.value) / 1500) * 100);

async function loadDashboard() {
  try {
    const [dashboard, focusStatistics] = await Promise.all([
      dashboardApi.get(),
      focusRecordsApi.statistics(),
    ]);
    data.value = dashboard;
    statistics.value = focusStatistics;
  } catch {
    data.value = {
      nickname: "Sherry",
      goals: [],
      focusRecords: [],
      profile: {
        type: "深度成长型",
        bestTime: "9-12点",
        strength: "长时间专注能力强",
        weakness: "初始启动较慢",
        suggestion: "把大目标拆成更小的行动，每次只关注眼前一步。",
      },
    };
  }
}

async function createPlan() {
  if (!goalInput.value.trim()) return;

  loading.value = true;
  planError.value = "";
  try {
    const goal = await goalsApi.createPlan({
      title: goalInput.value,
      mood: mood.value,
    });
    if (data.value) data.value.goals = [goal, ...data.value.goals];
    tab.value = "plan";
  } catch (error) {
    planError.value = getApiErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function startFocus(task: Task) {
  selected.value = task;
  seconds.value = 1500;
  finished.value = false;
  tab.value = "focus";
  running.value = true;
  startTimer();
}

async function updateTaskStatus(task: Task, status: "TODO" | "DONE") {
  const updated = await tasksApi.update(task.id, { status });
  task.status = updated.status;
}

function startTimer() {
  clearInterval(timer);
  timer = window.setInterval(() => {
    if (running.value && seconds.value > 0) seconds.value--;
    if (seconds.value === 0) completeFocus();
  }, 1000);
}

async function completeFocus() {
  running.value = false;
  clearInterval(timer);
  const record = await focusRecordsApi.create({
    taskId: selected.value?.id,
    duration: 1500 - seconds.value,
    distractionCount: 0,
    focusScore: 5,
  });
  if (data.value) data.value.focusRecords.unshift(record);
  statistics.value = await focusRecordsApi.statistics();
  if (selected.value) selected.value.status = "DONE";
  finished.value = true;
}

onMounted(loadDashboard);
onUnmounted(() => clearInterval(timer));
</script>

<style>
:root {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #292b28;
  background: #f7f3ed;
  --sage: #91a79d;
  --sage-dark: #718b7e;
  --sage-soft: #dfe7e1;
  --cream: #fbf8f3;
  --sand: #eee7dd;
  --blush: #ead3cb;
  --peach: #f3dfcf;
  --line: #e5ddd3;
  --muted: #8b8983;
  --shadow: 0 12px 36px rgba(83, 72, 60, 0.07);
}

* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
  background: #f7f3ed;
  color: #292b28;
}
button {
  font: inherit;
}
.app-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 8%, #fffdf9 0, transparent 32%),
    linear-gradient(135deg, #f5f0e9, #fbf8f3 58%, #f2eee7);
}
main {
  min-width: 0;
}
.page {
  max-width: 1050px;
  margin: 0 auto;
  padding: 38px 4vw 70px;
}
.eyebrow {
  font-size: 11px;
  color: #768b81;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.goal-card,
.analysis,
.roadmap,
.focus-card,
.profile-card,
.chart,
.suggest,
.empty {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: rgba(255, 253, 249, 0.82);
  box-shadow: var(--shadow);
}
.primary,
.soft {
  padding: 14px 25px;
  border: 0;
  border-radius: 11px;
  cursor: pointer;
}
.primary {
  color: white;
  background: linear-gradient(135deg, #91a99d, #718b7e);
  box-shadow: 0 7px 17px rgba(91, 121, 106, 0.18);
}
.primary:hover {
  background: linear-gradient(135deg, #839d90, #637f72);
}
.soft {
  color: #555750;
  background: #eee7dd;
}
.avatar {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  background: linear-gradient(145deg, #a7b9ae, #7f998d);
  box-shadow: 0 5px 14px rgba(92, 116, 104, 0.18);
}
@media (max-width: 760px) {
  .app-shell {
    display: block;
  }
  .page {
    padding: 24px 18px calc(110px + env(safe-area-inset-bottom));
  }
}
</style>
