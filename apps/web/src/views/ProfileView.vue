<template>
  <section class="page">
    <div class="empty">
      <div class="avatar big">S</div>
      <h2>{{ nickname || "Sherry" }}</h2>
      <p>成长型开发者 · 连续专注 7 天</p>
      <button class="soft">编辑个人资料</button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ nickname?: string }>();
</script>

<style scoped>
.empty {
  padding: 70px;
  text-align: center;
}
.big {
  width: 80px;
  height: 80px;
  margin: auto;
  font-size: 28px;
}
</style>
