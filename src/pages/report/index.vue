<template>
  <div id="app" class="app_wrap">
    <Header title="BUG REPORT" rightIcon="menu" @right-action="openMenu" />
    <div class="btns_wrapper">
      <button class="noti_btn" @click="openNotice">
        <img :src="notiIcon" alt="공지사항 아이콘" />
      </button>
      <div class="btns_inner">
        <button class="theme_toggle_btn" @click="toggleTheme">
          <img
            :src="theme === 'light' ? moonIcon : starIcon"
            :alt="theme === 'light' ? '달 아이콘' : '별 아이콘'"
          />
        </button>
        <button class="help_btn" @click="openModal('help', '도움말')">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1904_299)">
              <path
                d="M12 2L12.642 2.005L13.258 2.022L13.557 2.035L14.136 2.069L14.689 2.115C19.376 2.57 21.339 4.448 21.855 9.021L21.885 9.311L21.931 9.864L21.972 10.591L21.978 10.741L21.995 11.358L22 12L21.995 12.642L21.978 13.258L21.965 13.557L21.931 14.136L21.885 14.689C21.43 19.376 19.552 21.339 14.979 21.855L14.689 21.885L14.136 21.931L13.409 21.972L13.259 21.978L12.642 21.995L12 22L11.358 21.995L10.742 21.978L10.443 21.965L9.86398 21.931L9.31098 21.885C4.62398 21.43 2.66098 19.552 2.14498 14.979L2.11498 14.689L2.06898 14.136L2.02798 13.409L2.02198 13.259L2.00498 12.642L2.00098 12.324V11.676L2.00498 11.358L2.02198 10.742L2.03498 10.443L2.06898 9.864L2.11498 9.311C2.56998 4.624 4.44798 2.661 9.02098 2.145L9.31098 2.115L9.86398 2.069L10.591 2.028L10.741 2.022L11.358 2.005C11.568 2.002 11.782 2 12 2ZM12 11H11L10.883 11.007C10.6399 11.0359 10.4159 11.153 10.2534 11.336C10.0909 11.519 10.0011 11.7552 10.0011 12C10.0011 12.2448 10.0909 12.481 10.2534 12.664C10.4159 12.847 10.6399 12.9641 10.883 12.993L11 13V16L11.007 16.117C11.0333 16.3402 11.1341 16.5481 11.293 16.707C11.4519 16.8659 11.6598 16.9667 11.883 16.993L12 17H13L13.117 16.993C13.3402 16.9667 13.548 16.8659 13.707 16.707C13.8659 16.5481 13.9667 16.3402 13.993 16.117L14 16L13.993 15.883C13.9691 15.679 13.8829 15.4873 13.7462 15.3339C13.6095 15.1806 13.4289 15.0731 13.229 15.026L13.117 15.006L13 15V12L12.993 11.883C12.9667 11.6598 12.8659 11.4519 12.707 11.293C12.548 11.1341 12.3402 11.0333 12.117 11.007L12 11ZM12.01 8L11.883 8.007C11.6399 8.03591 11.4159 8.15296 11.2534 8.33597C11.0909 8.51897 11.0011 8.75524 11.0011 9C11.0011 9.24476 11.0909 9.48103 11.2534 9.66403C11.4159 9.84704 11.6399 9.96409 11.883 9.993L12 10L12.127 9.993C12.37 9.96409 12.594 9.84704 12.7566 9.66403C12.9191 9.48103 13.0089 9.24476 13.0089 9C13.0089 8.75524 12.9191 8.51897 12.7566 8.33597C12.594 8.15296 12.37 8.03591 12.127 8.007L12.01 8Z"
                fill="url(#paint0_linear_1904_299)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_1904_299"
                x1="2.00098"
                y1="2"
                x2="25.0434"
                y2="17.4656"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6000B4" />
                <stop offset="1" stop-color="#006192" />
              </linearGradient>
              <clipPath id="clip0_1904_299">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
    <main class="main_content">
      <!-- 탭 버튼 (모바일 전용) -->
      <div class="tab_wrapper" v-if="isMobile">
        <button
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
        >
          리포트 작성
        </button>
        <button
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
        >
          리포트 내역
        </button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div v-if="!isMobile" class="desktop_layout">
        <ReportForm />
        <ReportList />
      </div>

      <div v-else class="mobile_layout">
        <ReportForm v-if="activeTab === 'form'" />
        <ReportList v-else />
      </div>
    </main>

    <!-- 마이페이지 오버레이 -->
    <transition name="mypage-slide" :appear="false">
      <div v-if="isMenuOpen" class="mypage_overlay">
        <Mypage @close-menu="closeMenu" />
      </div>
    </transition>

    <!-- 전역 모달 -->
    <Modal
      v-if="isOpen"
      :type="modalType"
      :title="modalTitle"
      :message="modalMessage"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :confirm-label="confirmLabel"
      @confirm="confirm"
      @cancel="cancel"
      @close="closeModal"
    >
      <!-- 도움말 전용 콘텐츠 (type === 'help'일 때만 보이게) -->
      <template #help>
        <div class="help_list">
          <p class="help_text">1. 자유롭게 등록/수정/삭제가 가능합니다.</p>
          <p class="help_text">2. 모든 리포트는 익명으로 작성됩니다.</p>
          <p class="help_text">3. 카테고리 추가는 관리자에게 요청해 주세요.</p>
        </div>
        <div class="line"></div>
        <div class="help_actions">
          <div class="help_action">
            <img src="/src/assets/images/open_icon.png" alt="" />
            <p>펼치기</p>
          </div>
          <div class="help_action">
            <img src="/src/assets/images/close_icon.png" alt="" />
            <p>접기</p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import ReportForm from '@/pages/report/ReportForm.vue';
import ReportList from '@/pages/report/ReportList.vue';
import Modal from '@/components/Modal.vue';
import { useModal } from '@/composables/useModal.js';
import { useTheme } from '@/composables/useTheme.js';
import { useGroups } from '@/composables/useGroups';
import { useAuth } from '@/composables/useAuth';
import moonIcon from '@/assets/images/night_icon.png';
import starIcon from '@/assets/images/light_icon.png';
import notiIcon from '@/assets/images/notification_icon.png';
import Mypage from '@/pages/mypage/index.vue';

const router = useRouter();

// 마이페이지 열고 닫기
const isMenuOpen = ref(false);
const openMenu = () => {
  isMenuOpen.value = true;
};
const closeMenu = () => {
  isMenuOpen.value = false;
};

// 전역 모달 상태
const {
  isOpen,
  modalType,
  modalTitle,
  modalMessage,
  okLabel,
  cancelLabel,
  confirmLabel,
  openModal,
  closeModal,
  confirm,
  cancel
} = useModal();

const activeTab = ref('form');
const isMobile = ref(false);
const { theme, toggleTheme } = useTheme();

// 그룹 / 유저 정보
const { currentGroupId, loadUserGroup } = useGroups();
const { currentUser, isAuthReady } = useAuth();

// 공지사항 배열
const notices = [
  '1. 로그인 기능 추가',
  '2. 그룹 ID 설정 추가',
  '3. 공유 기능 추가',
  '4. 마이페이지 추가',
  '5. 로그아웃 추가',
  '6. 공지사항 기능 추가'
];

// 공지 모달 열기
const openNotice = () => {
  const message = notices.join('\n');
  openModal('alert', '공지사항', message);
};

const checkScreen = () => {
  isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
  checkScreen();
  window.addEventListener('resize', checkScreen);

  // 🔥 Firebase Auth가 "준비"된 이후에만 라우팅/그룹 체크
  const stop = watch(
    () => isAuthReady.value,
    async (ready) => {
      if (!ready) return; // 아직 onAuthStateChanged 응답 안 온 상태이면 기다림

      stop(); // 한 번만 실행

      // 진짜 로그아웃 상태라면 로그인 화면으로
      if (!currentUser.value) {
        router.replace('/signup');
        return;
      }

      // 로그인 상태면 그룹 정보 로딩
      await loadUserGroup();

      // 로그인은 했는데 그룹이 없으면 → 그룹 설정 플로우로
      if (!currentGroupId.value) {
        router.replace('/signup'); // 필요하면 '/signup/groupjoin' 등으로 변경 가능
      }
    },
    { immediate: true }
  );
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen);
});
</script>

<style scoped lang="scss">
#app,
.app_wrap,
.main_content {
  transform: none !important;
  transition: none !important;
}

.mypage_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  z-index: 100;
  overflow: hidden;
  background: transparent;
}

.mypage-slide-enter-active,
.mypage-slide-leave-active {
  transition: transform 0.35s ease;
}

.mypage-slide-enter-from {
  transform: translateX(100%);
}
.mypage-slide-enter-to {
  transform: translateX(0);
}
.mypage-slide-leave-from {
  transform: translateX(0);
}
.mypage-slide-leave-to {
  transform: translateX(100%);
}

.mypage_overlay :deep(.mypage_wrapper) {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
