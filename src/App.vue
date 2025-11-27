<template>
  <transition :name="transitionName" mode="out-in">
    <router-view />
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const transitionName = ref('slide-left');

watch(
  () => route.fullPath,
  (to, from) => {
    const fadeRoutes = ['/splash', '/signup'];

    // 스플래시 <-> 회원가입 구간은 페이드
    if (fadeRoutes.includes(to) || fadeRoutes.includes(from)) {
      transitionName.value = 'fade';
      return;
    }

    // 마이페이지 → 리포트는 오른쪽에서 들어오기
    if (from === '/mypage' && to === '/report') {
      transitionName.value = 'slide-right';
    } else {
      // 그 외 기본은 왼쪽으로 슬라이드
      transitionName.value = 'slide-left';
    }
  },
  { immediate: true } // 첫 진입 시에도 한 번 계산
);
</script>

<style scoped>
/* 슬라이드 전환 설정 */
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

/* 페이드 전환 설정 (스플래시/회원가입용) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
