<!-- <template>
  <transition :name="transitionName" mode="out-in">
    <router-view />
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const transitionName = ref('slide-left');

// 라우트 이동 감지해서 방향 결정
watch(
  () => route.fullPath,
  (to, from) => {
    if (from === '/mypage' && to === '/report') {
      transitionName.value = 'slide-right';
    } else {
      transitionName.value = 'slide-left';
    }
  }
);
</script>

<style scoped>
/* 기본 전환 설정 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s ease;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-enter-to {
  transform: translateX(0);
}
.slide-left-leave-from {
  transform: translateX(0);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave-from {
  transform: translateX(0);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style> -->
<template>
  <div style="padding:40px; font-size:20px; color:#000;">
    here is app
  </div>
</template>

<script setup></script>
