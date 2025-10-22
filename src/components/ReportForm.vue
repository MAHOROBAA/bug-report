<template>
  <section class="report_form">
    <h2>리포트 작성</h2>

    <div class="form_row">
      <div class="form_field">
        <label>카테고리</label>
        <div class="custom_select" @click="toggleCategory">
          <span>{{ selectedCategory || '선택하세요' }}</span>
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
      <textarea id="content" placeholder="리포트 내용을 입력하세요"></textarea>
    </div>

    <button class="submit_btn">기록</button>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const categories = ['기억손실', '말바꾸기', '황당언행', '인성확인'];

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

<style scoped>
.reportForm {
  background: #f6f0ff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.formRow {
  display: flex;
  gap: 12px;
}

.formField {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #2b2b38;
}

input,
textarea {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.submit_btn {
  background: #7d4fff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.submit_btn:hover {
  opacity: 0.9;
}

/* 커스텀 셀렉트 */
.custom_select {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.select_list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.select_list li {
  padding: 10px 12px;
  transition: 0.2s;
}

.select_list li:hover {
  background: #f6f0ff;
}

/* 모바일 조정 */
@media (max-width: 430px) {
  .reportForm {
    padding: 20px;
  }

  .formRow {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
