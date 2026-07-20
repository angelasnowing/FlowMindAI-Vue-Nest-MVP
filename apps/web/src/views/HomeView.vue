<template>
  <section class="page home">
    <div class="hero">
      <div>
        <span class="eyebrow">今日状态</span>
        <h1>现在的你处于<br /><em>什么状态？</em></h1>
        <p>觉察自己，是进入心流的第一步。</p>
      </div>
      <div class="quote">
        “专注不是用力，<br />而是温柔地回到当下。”
        <span>FLOW NOTE · 07</span>
      </div>
    </div>

    <div class="moods">
      <button
        v-for="item in moods"
        :key="item.title"
        :class="{ chosen: currentState === item.title }"
        @click="currentState = item.title"
      >
        <span>{{ item.emoji }}</span>
        <b>{{ item.title }}</b>
        <small>{{ item.description }}</small>
      </button>
    </div>

    <div class="goal-card">
      <div>
        <span class="eyebrow">目标输入</span>
        <h3>今天想完成什么？</h3>
      </div>
      <span class="counter">{{ goalInput.length }} / 300</span>
      <el-input v-model="goalInput" type="textarea" :rows="4" resize="none" />
      <button
        class="primary"
        :disabled="loading || !canCreatePlan"
        @click="$emit('createPlan')"
      >
        {{ loading ? "正在生成成长计划…" : "AI 生成成长计划 ✦" }}
      </button>
      <p v-if="!currentState" class="plan-hint">请先选择你当前的状态。</p>
      <p v-if="errorMessage" class="plan-error">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineProps<{ loading: boolean; errorMessage?: string }>();
defineEmits<{ createPlan: [] }>();

const goalInput = defineModel<string>("goalInput", { required: true });
const currentState = defineModel<string>("currentState", { required: true });
const canCreatePlan = computed(() =>
  Boolean(currentState.value && goalInput.value.trim()),
);

const moods = [
  { emoji: "😌", title: "能量较低", description: "不妨从小事开始" },
  { emoji: "🙂", title: "目标清晰", description: "保持节奏向前走" },
  { emoji: "⭐", title: "状态不错", description: "适合挑战深度任务" },
];
</script>

<style scoped>
.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.hero h1 {
  margin: 10px 0;
  font-size: 38px;
  line-height: 1.25;
}
.hero em {
  color: var(--sage-dark);
  font-style: normal;
}
.hero p {
  color: var(--muted);
}
.quote {
  padding: 25px 30px;
  border: 1px solid rgba(220, 210, 199, 0.75);
  border-radius: 20px;
  color: #68645e;
  line-height: 1.8;
  background: linear-gradient(145deg, #efe9e0, #e9e2d8);
}
.quote span {
  display: block;
  margin-top: 12px;
  color: #aaa;
  font-size: 9px;
  letter-spacing: 2px;
}
.moods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 35px 0;
}
.moods button {
  display: grid;
  gap: 7px;
  padding: 22px;
  border: 1px solid rgba(226, 217, 207, 0.55);
  border-radius: 17px;
  color: #4d4d49;
  background: #f3e5d5;
  cursor: pointer;
  transition: 0.2s ease;
}
.moods button:nth-child(1) {
  background: #dfe8e1;
}
.moods button:nth-child(3) {
  background: #efd8d1;
}
.moods button.chosen {
  border-color: var(--sage-dark);
  box-shadow: 0 10px 26px rgba(113, 139, 126, 0.17);
  transform: translateY(-2px);
}
.moods span {
  font-size: 30px;
}
.moods small {
  color: var(--muted);
}
.goal-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
}
.goal-card h3 {
  margin: 6px 0;
}
.goal-card :deep(.el-textarea),
.goal-card .primary {
  grid-column: 1/-1;
}
.goal-card :deep(.el-textarea__inner) {
  padding: 16px !important;
  border-radius: 12px !important;
  color: #353631 !important;
  background: #fffdf9 !important;
  box-shadow: 0 0 0 1px #e3d9cd inset !important;
}
.counter {
  color: #aaa;
  font-size: 11px;
}
.plan-error {
  grid-column: 1/-1;
  margin: 0;
  color: #a55f55;
  font-size: 13px;
}
.plan-hint {
  grid-column: 1/-1;
  margin: -6px 0 0;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}
.primary:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}
@media (max-width: 760px) {
  .hero {
    display: block;
  }
  .hero h1 {
    font-size: 28px;
  }
  .quote {
    display: none;
  }
  .moods {
    gap: 8px;
  }
  .moods button {
    padding: 15px 6px;
  }
  .moods small {
    display: none;
  }
  .goal-card {
    padding: 20px;
  }
}
</style>
