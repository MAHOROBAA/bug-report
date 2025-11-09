<template>
  <div class="modal_overlay" @click.self="emit('close')">
    <div class="modal_box">
      <h3 v-if="title" class="modal_title">{{ title }}</h3>

      <!-- 메시지 -->
      <p
        v-if="message"
        class="modal_message"
        :class="{ notice_message: title === '공지사항' }"
      >
        {{ message }}
      </p>

      <!-- 슬롯 (도움말 같은 커스텀 콘텐츠) -->
      <slot v-if="type === 'help'" name="help" />
      <slot v-else />

      <!-- 버튼 영역 -->
      <div class="modal_buttons" :class="`type_${type}`">
        <template v-if="type === 'confirm'">
          <button class="btn_cancel" @click="emit('cancel')">취소</button>
          <button class="btn_confirm" @click="emit('confirm')">삭제</button>
        </template>
        <template v-else>
          <button class="btn_ok" @click="emit('confirm')">확인</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  type: String,
  title: String,
  message: String
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

let prevOverflow = '';

const onKey = (e) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => {
  prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKey);
});

onUnmounted(() => {
  document.body.style.overflow = prevOverflow;
  window.removeEventListener('keydown', onKey);
});
</script>
