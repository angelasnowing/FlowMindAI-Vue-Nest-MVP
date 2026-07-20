<template>
  <section class="page data">
    <div class="profile-card">
      <span class="eyebrow">你的心流画像</span>
      <h1>🌱 {{ profile?.type || "深度成长型" }}</h1>
      <p>你倾向深度工作、专注力稳定，学习能力强。</p>
      <div class="plant">●<span>❋</span></div>
    </div>
    <div class="metrics">
      <div>
        <small>总专注时长</small
        ><b>{{ formatDuration(statistics.totalDuration) }}</b>
      </div>
      <div>
        <small>专注次数</small><b>{{ statistics.count }}</b>
      </div>
      <div>
        <small>平均专注时长</small
        ><b>{{ formatMinutes(statistics.averageDuration) }}</b>
      </div>
      <div>
        <small>专注度评分</small
        ><b>{{ statistics.averageFocusScore.toFixed(1) }}/5</b>
      </div>
    </div>
    <div class="chart">
      <h3>最佳专注时间段</h3>
      <div class="bars">
        <i
          v-for="(height, index) in bars"
          :key="index"
          :style="{ height: `${height}%` }"
        />
      </div>
      <div class="labels">
        <span v-for="label in timeLabels" :key="label">{{ label }}</span>
      </div>
    </div>
    <div class="suggest">
      <b>AI 建议 ✦</b>
      <p>{{ profile?.suggestion }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FlowProfile, FocusStatistics } from "../types";

defineProps<{ profile?: FlowProfile | null; statistics: FocusStatistics }>();

const bars = [18, 25, 82, 55, 34, 28, 12];
const timeLabels = ["6-9点", "9-12点", "12-15点", "15-18点", "18-21点"];

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
}

function formatMinutes(seconds: number) {
  return `${Math.round(seconds / 60)} min`;
}
</script>

<style scoped>
.data {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}
.profile-card {
  grid-row: span 2;
}
.profile-card h1 {
  margin-top: 18px;
  font-size: 25px;
}
.profile-card p {
  color: #777;
  line-height: 1.7;
}
.plant {
  display: grid;
  height: 210px;
  margin-top: 20px;
  place-items: center;
  border-radius: 50% 50% 35% 35%;
  color: #789184;
  font-size: 40px;
  background:
    radial-gradient(circle at 50% 55%, #91a79d 0 38px, transparent 39px),
    linear-gradient(150deg, transparent 45%, #b8c9bd 46% 53%, transparent 54%),
    #edf0e9;
}
.plant span {
  color: #6f8a7b;
  font-size: 50px;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 0;
}
.metrics div {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 13px;
  background: #eee7dd;
}
.metrics small {
  color: var(--muted);
}
.metrics b {
  font-size: 18px;
}
.chart h3 {
  margin-top: 0;
}
.bars {
  display: flex;
  height: 150px;
  align-items: end;
  gap: 8%;
  padding: 0 7%;
  border-bottom: 1px solid var(--line);
}
.bars i {
  width: 35px;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(#8fa69a, #d5dfd8);
}
.labels {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  color: #888;
  font-size: 10px;
}
.suggest {
  grid-column: 1/-1;
  background: linear-gradient(120deg, #f1ebe3, #e5ece6);
}
@media (max-width: 760px) {
  .data {
    grid-template-columns: 1fr;
  }
  .metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  .profile-card {
    grid-row: auto;
  }
}
</style>
