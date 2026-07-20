<template>
  <div v-if="visible" class="pwa-status" role="status">
    <span v-if="!online">当前处于离线模式，可查看最近缓存的数据。</span>
    <span v-else-if="needRefresh">发现新版本，更新后即可使用。</span>
    <span v-else-if="offlineReady">应用已支持离线访问。</span>
    <span v-else>可将 FlowMindAI 安装到桌面。</span>

    <button v-if="canInstall" @click="installApp">安装应用</button>
    <button v-if="needRefresh" @click="updateServiceWorker(true)">
      立即更新
    </button>
    <button v-if="offlineReady" class="close" @click="offlineReady = false">
      知道了
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const online = ref(navigator.onLine);
const installPrompt = shallowRef<BeforeInstallPromptEvent>();
const canInstall = computed(() => Boolean(installPrompt.value));

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisterError(error) {
    console.error("PWA service worker registration failed", error);
  },
});

const visible = computed(
  () =>
    !online.value ||
    canInstall.value ||
    offlineReady.value ||
    needRefresh.value,
);

function handleOnline() {
  online.value = true;
}

function handleOffline() {
  online.value = false;
}

function handleInstallPrompt(event: Event) {
  event.preventDefault();
  installPrompt.value = event as BeforeInstallPromptEvent;
}

async function installApp() {
  if (!installPrompt.value) return;
  await installPrompt.value.prompt();
  await installPrompt.value.userChoice;
  installPrompt.value = undefined;
}

onMounted(() => {
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("beforeinstallprompt", handleInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
  window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
});
</script>

<style scoped>
.pwa-status {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 30;
  display: flex;
  max-width: min(420px, calc(100vw - 36px));
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: #4f5e57;
  font-size: 13px;
  background: rgba(255, 253, 249, 0.96);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}
.pwa-status span {
  flex: 1;
}
.pwa-status button {
  padding: 7px 11px;
  border: 0;
  border-radius: 9px;
  color: white;
  white-space: nowrap;
  background: var(--sage-dark);
  cursor: pointer;
}
.pwa-status .close {
  color: #5f625e;
  background: var(--sand);
}
@media (max-width: 760px) {
  .pwa-status {
    top: auto;
    right: 12px;
    bottom: calc(88px + env(safe-area-inset-bottom));
    left: 12px;
  }
}
</style>
