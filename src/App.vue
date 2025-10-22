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
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  font-family: 'Pretendard Variable', Pretendard, -apple-system,
    BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #2b2b38;
  background-color: #fff;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}

/* 앱 전체 레이아웃 */
.app_wrap {
  margin: 0 auto;
  padding: 76px 20px 20px;
}

.main_content {
  width: 100%;
  max-width: 1200px;
  margin: 50px auto;
}

/* 모바일 대응 */
@media screen and (max-width: 430px) {
  .app_wrap {
    padding: 50px 20px 20px;
  }
  .main_content {
    margin: 40px auto;
  }
}
</style>
