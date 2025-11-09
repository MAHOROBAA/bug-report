<template>
  <div class="mypage_wrapper">
    <Header
      v-if="!isTermsOpen"
      title="BUG REPORT"
      leftIcon="close-menu"
      @left-action="emitClose"
    />
    <div class="menu_wrapper">
      <div
        class="menu_inner"
        :class="{ open: activeMenu === 'info' }"
        @click="toggleMenu('info')"
      >
        <div class="left">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_16_667)">
              <path
                d="M12.007 1L12.245 1.005C13.4393 1.05368 14.5918 1.45796 15.5548 2.166C16.5178 2.87404 17.2474 3.85357 17.65 4.979L17.728 5.212C18.1463 6.55144 18.0819 7.99512 17.546 9.292L17.453 9.502L17.503 9.5C18.0387 9.48757 18.5675 9.62176 19.0325 9.88806C19.4974 10.1544 19.8807 10.5427 20.141 11.011L20.222 11.169C20.5351 11.8354 20.5817 12.5963 20.3523 13.296C20.123 13.9957 19.6349 14.5813 18.988 14.933L18.798 15.029L17 15.85V16.813L18.166 17.979L18.306 18.133C18.7843 18.7 19.0322 19.426 19.0008 20.1671C18.9693 20.9083 18.6607 21.6106 18.136 22.135C17.049 23.223 15.309 23.296 14.106 22.279L13.946 22.133L12 20.185L10.054 22.132C9.5387 22.6495 8.8503 22.9582 8.12115 22.9988C7.392 23.0394 6.67357 22.8091 6.104 22.352L5.954 22.224C4.784 21.151 4.67 19.345 5.72 18.104L5.866 17.946L7 16.812V15.85L5.166 15.01L4.985 14.917C4.34545 14.5619 3.865 13.9767 3.6412 13.2802C3.41741 12.5837 3.46703 11.8282 3.78 11.167C4.01943 10.6687 4.39494 10.2483 4.86315 9.95442C5.33137 9.6605 5.87318 9.50504 6.426 9.506L6.556 9.509L6.526 9.445C6.24952 8.82172 6.0795 8.1565 6.023 7.477L6.006 7.217V7C6.00594 5.44762 6.60757 3.95564 7.68446 2.83753C8.76136 1.71942 10.2297 1.06221 11.781 1.004L12.005 1H12.007ZM12.01 16H12C11.7348 16 11.4804 16.1054 11.2929 16.2929C11.1054 16.4804 11 16.7348 11 17C11 17.2652 11.1054 17.5196 11.2929 17.7071C11.4804 17.8946 11.7348 18 12 18H12.01C12.2752 18 12.5296 17.8946 12.7171 17.7071C12.9046 17.5196 13.01 17.2652 13.01 17C13.01 16.7348 12.9046 16.4804 12.7171 16.2929C12.5296 16.1054 12.2752 16 12.01 16ZM12.01 13H12C11.7348 13 11.4804 13.1054 11.2929 13.2929C11.1054 13.4804 11 13.7348 11 14C11 14.2652 11.1054 14.5196 11.2929 14.7071C11.4804 14.8946 11.7348 15 12 15H12.01C12.2752 15 12.5296 14.8946 12.7171 14.7071C12.9046 14.5196 13.01 14.2652 13.01 14C13.01 13.7348 12.9046 13.4804 12.7171 13.2929C12.5296 13.1054 12.2752 13 12.01 13ZM12.01 8H12C11.7348 8 11.4804 8.10536 11.2929 8.29289C11.1054 8.48043 11 8.73478 11 9C11 9.26522 11.1054 9.51957 11.2929 9.70711C11.4804 9.89464 11.7348 10 12 10H12.01C12.2752 10 12.5296 9.89464 12.7171 9.70711C12.9046 9.51957 13.01 9.26522 13.01 9C13.01 8.73478 12.9046 8.48043 12.7171 8.29289C12.5296 8.10536 12.2752 8 12.01 8ZM10.01 5H10C9.73478 5 9.48043 5.10536 9.29289 5.29289C9.10536 5.48043 9 5.73478 9 6C9 6.26522 9.10536 6.51957 9.29289 6.70711C9.48043 6.89464 9.73478 7 10 7H10.01C10.2752 7 10.5296 6.89464 10.7171 6.70711C10.9046 6.51957 11.01 6.26522 11.01 6C11.01 5.73478 10.9046 5.48043 10.7171 5.29289C10.5296 5.10536 10.2752 5 10.01 5ZM14.01 5H14C13.7348 5 13.4804 5.10536 13.2929 5.29289C13.1054 5.48043 13 5.73478 13 6C13 6.26522 13.1054 6.51957 13.2929 6.70711C13.4804 6.89464 13.7348 7 14 7H14.01C14.2752 7 14.5296 6.89464 14.7171 6.70711C14.9046 6.51957 15.01 6.26522 15.01 6C15.01 5.73478 14.9046 5.48043 14.7171 5.29289C14.5296 5.10536 14.2752 5 14.01 5Z"
                fill="url(#paint0_linear_16_667)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_16_667"
                x1="3.50312"
                y1="1"
                x2="25.8872"
                y2="12.6032"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6000B4" />
                <stop offset="1" stop-color="#006192" />
              </linearGradient>
              <clipPath id="clip0_16_667">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="menutitle">내 정보</p>
        </div>
        <div class="right">
          <svg
            class="arrow_icon"
            :class="{ rotated: activeMenu === 'info' }"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#848A9C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <transition name="submenu">
        <div v-show="activeMenu === 'info'" class="submenu_wrapper">
          <div class="submenu_inner">
            <p class="submenutitle">그룹 ID 확인</p>
          </div>
          <div class="submenu_inner">
            <p class="submenutitle">링크 공유하기</p>
          </div>
        </div>
      </transition>
      <div class="menu_inner" @click="openTerms">
        <div class="left">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_16_745)">
              <path
                d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 12H15"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 16H15"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_16_745">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="menutitle">이용약관</p>
        </div>
        <div class="right">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#848A9C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="menu_inner">
        <div class="left">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_16_727)">
              <path
                d="M14 8V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H12C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18V16"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 12H21L18 9"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 15L21 12"
                stroke="#535765"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_16_727">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="menutitle">로그아웃</p>
        </div>
        <div class="right">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#848A9C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <TermsModal
      v-if="isTermsOpen"
      :showAgree="false"
      @close-terms="isTermsOpen = false"
    />
  </transition>
</template>
<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import TermsModal from '@/pages/signup/TermsModal.vue';

const emit = defineEmits(['close-menu']);
const emitClose = () => emit('close-menu');
// 현재 열려 있는 메뉴 상태 저장
const activeMenu = ref(null);

// 토글 함수
const toggleMenu = (menuName) => {
  activeMenu.value = activeMenu.value === menuName ? null : menuName;
};

// 약관보기
const isTermsOpen = ref(false);
const openTerms = () => (isTermsOpen.value = true);
</script>
