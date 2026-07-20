<template>
  <section class="page plan">
    <div class="analysis">
      <span class="eyebrow">AI 分析结果</span>
      <div class="insights">
        <div>
          <h4>你的优势</h4>
          <p>✓ 前端基础扎实</p>
          <p>✓ 有工程化经验</p>
          <p>✓ 学习动力强</p>
        </div>
        <div class="warn">
          <h4>当前挑战</h4>
          <p>△ 后端架构经验不足</p>
          <p>△ 缺少完整项目经验</p>
          <p>△ 容易焦虑和拖延</p>
        </div>
      </div>
    </div>

    <div class="roadmap">
      <p v-if="goal?.generationSource === 'fallback'" class="fallback-note">
        当前大模型额度不可用，以下任务由本地临时模板生成。
      </p>
      <span class="eyebrow">推荐成长路线 · 3个月</span>
      <div class="months">
        <div v-for="month in months" :key="month.name">
          <b>{{ month.name }}</b
          ><small>{{ month.description }}</small>
        </div>
      </div>
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

const months = [
  { name: "第1月", description: "后端基础" },
  { name: "第2月", description: "项目实战" },
  { name: "第3月", description: "部署上线" },
];

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
.insights {
  display: grid;
  gap: 13px;
  margin-top: 20px;
}
.insights > div {
  padding: 15px;
  border-radius: 13px;
  font-size: 13px;
  line-height: 1.5;
  background: #e3ebe5;
}
.insights .warn {
  background: #f2dfd3;
}
.months {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0 28px;
}
.months div {
  padding: 17px;
  border-radius: 14px;
  text-align: center;
  background: #eee7dd;
}
.months div:nth-child(2) {
  background: #e3e8df;
}
.months div:nth-child(3) {
  background: #e8ddd3;
}
.months small {
  display: block;
  margin-top: 5px;
  color: #888;
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
