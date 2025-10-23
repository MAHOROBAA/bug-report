<template>
  <section class="report_form">
    <h2>리포트 작성</h2>
    <div class="form_wrapper">
      <div class="form_row">
        <div class="form_field">
          <label>카테고리</label>
          <div class="custom_select" @click="toggleCategory">
            <span>{{ selectedCategory || '선택하세요' }}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.747 7.62646L10 12.3735L5.25298 7.62646" stroke="#A6ABBA" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
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
        <textarea id="content" placeholder="리포트 내용을 입력하세요"></textarea>
      </div>
      <button class="submit_btn">기록</button>
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

<style scoped>
h2 {
  font-size: 20px;
  font-weight: 700;
}

.report_form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form_wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #F6F0FE;
  border-radius: 20px;
  padding: 20px;
}

.form_row {
  display: flex;
  gap: 10px;
}

.form_field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 12px;
  font-weight: 500;
  color: #6D7284;
}

input {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background: #fff;
  outline: none;
}

input::placeholder {
  color: #BDC2CF;
}

textarea {
  width: 100%;
  font-family: 'Pretendard Variable';
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  background: #fff;
  outline: none;
  min-height: 52px;
  resize: vertical;
}

textarea::placeholder {
  font-family: 'Pretendard Variable';
  font-size: 16px;
  color: #BDC2CF;
}

.submit_btn {
  color: #F8F9FB;
  border: none;
  border-radius: 8px;
  background: linear-gradient(124deg, #6000B4 0%, #006192 100%);
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}
.submit_btn:hover {
  opacity: 0.9;
}

.submit_btn:disabled {
  background: #BDC1CF;
}

/* 커스텀 셀렉트 */
.custom_select {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  width: 119px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom_select span {
  color: #BDC1CF;
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
@media screen and (max-width: 360px){
  input::placeholder {
    letter-spacing: -0.14em;
  }
}

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
