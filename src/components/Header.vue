<template>
  <header class="header">
    <button
      v-if="leftIcon"
      class="icon_btn left"
      @click="$emit('left-action')"
      aria-label="left button"
    >
      <!-- 메뉴 닫기(마이페이지용) -->
      <svg
        v-if="leftIcon === 'close-menu'"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_22_490)">
          <path
            d="M3.93555 6H19.9355"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.93555 12H16.9355"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.93555 18H13.9355"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_22_490">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- 약관 닫기(마이페이지용) -->
      <svg
        v-else-if="leftIcon === 'close'"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_22_459)">
          <path
            d="M15 6L9 12L15 18"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_22_459">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
    <h1>{{ title }}</h1>
    <button
      v-if="rightIcon"
      class="icon_btn right"
      @click="$emit('right-action')"
      aria-label="right button"
    >
      <svg
        v-if="rightIcon === 'menu'"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_8_377)">
          <path
            d="M4 6H20"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 12H20"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 18H20"
            stroke="#535765"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_8_377">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  leftIcon: { type: String, default: null },
  rightIcon: { type: String, default: null }
});
</script>
