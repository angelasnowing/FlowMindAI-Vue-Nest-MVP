<template>
  <header>
    <div>
      <small>{{ today }}</small>
      <h2>{{ title }}</h2>
    </div>
    <div class="head-actions">
      <button class="icon-btn">🔔</button>
      <div class="avatar">S</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TabKey } from "../../types";

const props = defineProps<{ tab: TabKey; nickname?: string }>();

const title = computed(() => {
  const titles: Record<TabKey, string> = {
    home: `下午好，${props.nickname || "Sherry"} 👋`,
    plan: "你的成长计划",
    focus: "进入心流时刻",
    data: "心流画像",
    me: "个人中心",
  };
  return titles[props.tab];
});

const today = new Date().toLocaleDateString("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "long",
});
</script>

<style scoped>
header {
  display: flex;
  height: 95px;
  align-items: center;
  justify-content: space-between;
  padding: 24px 4vw;
  border-bottom: 1px solid var(--line);
  background: rgba(251, 248, 243, 0.65);
  backdrop-filter: blur(12px);
}
header small {
  color: var(--muted);
}
header h2 {
  margin: 5px 0 0;
  font-size: 22px;
}
.head-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: #5b625e;
  background: #fffdf9;
}
@media (max-width: 760px) {
  header {
    height: 80px;
    padding: 18px;
  }
}
</style>
