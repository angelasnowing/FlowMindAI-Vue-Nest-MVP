<template>
  <section class="page plan">
    <div class="analysis">
      <span class="eyebrow">AI 分析结果</span>
      <div v-if="goal" class="goal-summary">
        <span class="state-badge">{{ goal.currentState }}</span>
        <h2>{{ goal.title }}</h2>
        <p>{{ goal.description }}</p>
      </div>
      <p v-else class="empty-copy">请先在首页选择状态并输入目标。</p>
    </div>

    <div class="roadmap">
      <p v-if="goal?.generationSource === 'fallback'" class="fallback-note">
        当前大模型额度不可用，以下任务由本地临时模板生成。
      </p>
      <span class="eyebrow">状态与目标共同生成 · 今日成长计划</span>
      <div class="task-list">
        <h3>今日任务 <small>Day 1</small></h3>
        <article
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="{ done: task.status === 'DONE' }"
        >
          <span class="num">{{ index + 1 }}</span>
          <div>
            <b>{{ task.title }}</b>
            <small>预计 {{ task.estimatedTime }} 分钟</small>
          </div>
          <button @click="handleTask(task)">
            {{ task.status === "DONE" ? "重新打开" : "开始" }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Goal, Task } from "../types";

defineProps<{ goal?: Goal; tasks: Task[] }>();
const emit = defineEmits<{
  startFocus: [task: Task];
  updateTaskStatus: [task: Task, status: "TODO" | "DONE"];
}>();

function handleTask(task: Task) {
  if (task.status === "DONE") {
    emit("updateTaskStatus", task, "TODO");
    return;
  }
  emit("startFocus", task);
}
</script>

<style scoped>
.plan {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 22px;
}
.fallback-note {
  margin: 0 0 18px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #8b655b;
  font-size: 13px;
  background: #f5e4dc;
}
.goal-summary {
  margin-top: 20px;
}
.goal-summary h2 {
  margin: 16px 0 10px;
  font-size: 22px;
  line-height: 1.4;
}
.goal-summary p,
.empty-copy {
  color: #686b65;
  line-height: 1.8;
}
.state-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  color: #4e685c;
  font-size: 13px;
  font-weight: 700;
  background: var(--sage-soft);
}
.roadmap > .eyebrow {
  display: block;
  margin-bottom: 20px;
}
.task-list h3 small {
  font-weight: 400;
}
.task-list article {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 14px 3px;
  border-top: 1px solid var(--line);
}
.task-list article.done {
  opacity: 0.55;
}
.task-list article > div {
  display: grid;
  flex: 1;
  gap: 5px;
}
.task-list small {
  color: var(--muted);
}
.task-list article button {
  padding: 7px 14px;
  border: 1px solid #aebeb5;
  border-radius: 20px;
  color: #587166;
  background: #fffdf9;
}
.num {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  font-size: 11px;
  color: #68665f;
  background: #eee8df;
}
@media (max-width: 760px) {
  .plan {
    grid-template-columns: 1fr;
  }
}
</style>
