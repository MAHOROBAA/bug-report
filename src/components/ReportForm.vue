<template>
  <section class="report_form">
    <h2>리포트 작성</h2>
    <div class="form_wrapper">
      <div class="form_row">
        <div class="form_field">
          <label>카테고리</label>
          <div class="custom_select" @click="toggleCategory">
            <span>{{ selectedCategory || '선택하세요' }}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.747 7.62646L10 12.3735L5.25298 7.62646"
                stroke="#A6ABBA"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <ul v-if="isOpen" class="select_list">
              <li
                v-for="(item, idx) in categories"
                :key="idx"
                @click="selectCategory(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div class="form_field">
          <label for="time">발생시각</label>
          <input
            id="time"
            type="text"
            v-model="timeInput"
            placeholder="YYYY-MM-DD HH:MM"
            @input="formatTime"
            maxlength="16"
          />
        </div>
      </div>
      <div class="form_field">
        <label for="content">리포트</label>
        <textarea
          id="content"
          placeholder="리포트 내용을 입력하세요"
        ></textarea>
      </div>
      <button
        class="submit_btn"
        @click="modal.openModal('alert', '리포트가 기록되었어요.')"
      >
        기록
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const categories = ['❓ 기억손실', '☣ 말바꾸기', '🤯 황당언행', '💫 인성확인'];

const isOpen = ref(false);
const selectedCategory = ref('');
const timeInput = ref('');

const toggleCategory = () => (isOpen.value = !isOpen.value);
const selectCategory = (item) => {
  selectedCategory.value = item;
  isOpen.value = false;
};

const formatTime = () => {
  let v = timeInput.value.replace(/\D/g, '');
  if (v.length >= 5) v = v.replace(/(\d{4})(\d)/, '$1-$2');
  if (v.length >= 8) v = v.replace(/(\d{4}-\d{2})(\d)/, '$1-$2');
  if (v.length >= 11) v = v.replace(/(\d{4}-\d{2}-\d{2})(\d)/, '$1 $2');
  if (v.length >= 14) v = v.replace(/(\d{4}-\d{2}-\d{2} \d{2})(\d)/, '$1:$2');
  timeInput.value = v;
};
</script>
