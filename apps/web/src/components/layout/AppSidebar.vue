<template>
  <aside>
    <div class="brand"><span class="brand-mark">✦</span><b>FlowMindAI</b></div>
    <p class="aside-label">心流工作台</p>
    <nav>
      <button
        v-for="item in navigation"
        :key="item.key"
        :class="{ active: activeTab === item.key }"
        @click="activeTab = item.key"
      >
        <span>{{ item.icon }}</span
        >{{ item.name }}
      </button>
    </nav>
    <div class="aside-card">
      <span>🌱</span><b>连续成长 7 天</b><small>今天也向目标靠近了一点</small>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { TabKey } from "../../types";

const activeTab = defineModel<TabKey>({ required: true });

const navigation: Array<{ key: TabKey; name: string; icon: string }> = [
  { key: "home", name: "首页", icon: "⌂" },
  { key: "plan", name: "计划", icon: "▣" },
  { key: "focus", name: "专注", icon: "◷" },
  { key: "data", name: "数据", icon: "▥" },
  { key: "me", name: "我的", icon: "♙" },
];
</script>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  padding: 30px 22px;
  border-right: 1px solid var(--line);
  background: rgba(252, 249, 244, 0.9);
  box-shadow: 8px 0 30px rgba(91, 78, 64, 0.025);
}
.brand {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 20px;
}
.brand-mark {
  color: var(--sage-dark);
}
.aside-label {
  margin: 36px 12px 10px;
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 2px;
}
nav {
  display: grid;
  gap: 6px;
}
nav button {
  padding: 13px;
  border: 0;
  border-radius: 12px;
  color: #74756f;
  text-align: left;
  background: none;
  cursor: pointer;
}
nav button span {
  display: inline-block;
  width: 30px;
  font-size: 18px;
}
nav button:hover {
  color: #526a5f;
  background: #f1ece5;
}
nav button.active {
  color: #4e685c;
  font-weight: 700;
  background: var(--sage-soft);
  box-shadow: inset 3px 0 0 var(--sage-dark);
}
.aside-card {
  display: grid;
  gap: 7px;
  margin-top: auto;
  padding: 18px;
  border-radius: 16px;
  color: #476055;
  font-size: 13px;
  background: linear-gradient(145deg, #e6ede7, #dce6df);
}
.aside-card > span {
  font-size: 25px;
}
.aside-card small {
  color: #718078;
  line-height: 1.5;
}
@media (max-width: 760px) {
  aside {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    padding: 7px 10px;
    border-top: 1px solid var(--line);
    background: rgba(252, 249, 244, 0.96);
    box-shadow: 0 -8px 28px rgba(79, 67, 55, 0.06);
  }
  .brand,
  .aside-label,
  .aside-card {
    display: none;
  }
  nav {
    grid-template-columns: repeat(5, 1fr);
  }
  nav button {
    padding: 8px 3px;
    font-size: 10px;
    text-align: center;
  }
  nav button span {
    display: block;
    width: auto;
    font-size: 18px;
  }
  nav button.active {
    box-shadow: inset 0 3px 0 var(--sage-dark);
  }
}
</style>
