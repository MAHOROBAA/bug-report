<template>
  <div id="app" class="app_wrap">
    <Header />
    <main class="main_content">
      <ReportForm />
      <ReportList />
    </main>
    <HelpModal v-if="showHelp" @close="showHelp = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import ReportForm from './components/ReportForm.vue';
import ReportList from './components/ReportList.vue';
import HelpModal from './components/HelpModal.vue';

const showHelp = ref(false);
</script>

<style>
/* Pretendard Variable Dynamic Subset */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Pretendard Variable', Pretendard, -apple-system,
    BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  font-weight: 400;
  color: #2b2b38;
  background-color: #fafafa;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* 앱 전체 레이아웃 */
.app_wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main_content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 폰트 가중치 활용 예시 */
.medium {
  font-weight: 500;
}
.bold {
  font-weight: 700;
}
.extrabold {
  font-weight: 800;
}

/* 모바일 대응 */
@media (max-width: 430px) {
  .main_content {
    padding: 20px;
  }
}
</style>
