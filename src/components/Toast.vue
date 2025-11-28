<template>
  <div class="toast_container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast_item"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();
</script>

<style scoped>
.toast_container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.toast_item {
  min-width: 200px;
  max-width: 320px;
  padding: 10px 16px;
  margin-top: 8px;
  border-radius: 999px;
  text-align: center;
  font-size: 14px;
  background: rgba(40, 40, 50, 0.9);
  color: #fff;
}

/* 등장 */
.toast-enter-active {
  transition: all 0.35s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 사라짐 */
.toast-leave-active {
  transition: all 0.35s ease;
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 순서 정렬 보정 (여러 개일 때) */
.toast-move {
  transition: transform 0.25s ease;
}
</style>
