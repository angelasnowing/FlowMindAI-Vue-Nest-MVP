<template>
  <section class="page focus">
    <div class="focus-card">
      <span class="eyebrow">{{ running ? "正在专注" : "专注准备" }}</span>
      <h2>
        {{ selected?.title || fallbackTask?.title || "选择一个任务开始" }}
      </h2>
      <div class="timer" :style="timerStyle()">
        <div>
          <strong>{{ time }}</strong>
          <span>{{ running ? "专注中" : "保持呼吸" }}</span>
          <small>🌱</small>
        </div>
      </div>
      <div class="focus-stats">
        <div>
          <small>已专注</small
          ><b>{{ Math.floor((1500 - seconds) / 60) }} 分钟</b>
        </div>
        <div>
          <small>专注次数</small><b>{{ focusCount }}</b>
        </div>
        <div><small>干扰次数</small><b>0</b></div>
      </div>
      <div class="focus-actions">
        <button class="soft" @click="$emit('toggleRunning')">
          {{ running ? "暂停" : "继续" }}
        </button>
        <button class="primary" @click="$emit('complete')">完成任务</button>
      </div>
      <div v-if="finished" class="success">🎉 本次心流已记录，做得很好！</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StyleValue } from "vue";
import type { Task } from "../types";

const props = defineProps<{
  selected: Task | null;
  fallbackTask?: Task;
  time: string;
  progress: number;
  seconds: number;
  running: boolean;
  finished: boolean;
  focusCount: number;
}>();

defineEmits<{ toggleRunning: []; complete: [] }>();

const timerStyle = () => ({ "--p": `${props.progress}%` }) as StyleValue;
</script>

<style scoped>
.focus-card {
  max-width: 700px;
  margin: auto;
  text-align: center;
}
.focus-card h2 {
  margin: 12px;
  font-size: 18px;
}
.timer {
  --p: 0%;
  width: 330px;
  height: 330px;
  margin: 25px auto;
  padding: 12px;
  border-radius: 50%;
  background: conic-gradient(var(--sage-dark) var(--p), #e8dfd5 0);
  box-shadow: 0 12px 32px rgba(99, 117, 106, 0.14);
}
.timer > div {
  display: grid;
  height: 100%;
  place-content: center;
  gap: 6px;
  border-radius: 50%;
  background: #fffdf9;
}
.timer strong {
  font-size: 58px;
}
.timer span {
  font-weight: 700;
}
.timer small {
  font-size: 20px;
}
.focus-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 20px 0;
}
.focus-stats div {
  display: grid;
  gap: 8px;
}
.focus-stats small {
  color: var(--muted);
}
.focus-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
}
.success {
  margin-top: 18px;
  padding: 14px;
  border-radius: 12px;
  color: #526b5f;
  background: #e2ebe4;
}
@media (max-width: 760px) {
  .timer {
    width: 260px;
    height: 260px;
  }
  .timer strong {
    font-size: 45px;
  }
}
</style>
