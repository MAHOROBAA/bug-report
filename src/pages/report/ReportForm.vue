<template>
  <section class="report_form">
    <h2>리포트 작성</h2>
    <form class="form_wrapper" @submit.prevent="submitReport">
      <div class="form_row">
        <div class="form_field">
          <label>카테고리</label>
          <CustomSelect v-model="selectedCategory" />
        </div>
        <div class="form_field">
          <label for="time">발생시각</label>
          <input
            id="time"
            type="text"
            v-model="timeInput"
            :placeholder="nowPlaceholder"
            @input="formatTime"
            maxlength="16"
          />
        </div>
      </div>

      <div class="form_field">
        <label for="content">리포트</label>
        <textarea
          id="content"
          v-model="contentInput"
          placeholder="리포트 내용을 입력하세요"
          ref="textareaRef"
          @input="autoResize"
        ></textarea>
      </div>

      <button class="submit_btn" :disabled="!isFormValid">기록</button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useModal } from '../../composables/useModal.js';
import { useRandomMessage } from '../../composables/useRandomMessage.js';
import { useReports } from '../../composables/useReports.js';
import { useGroups } from '../../composables/useGroups.js';
import CustomSelect from '../../components/CustomSelect.vue';

// 전역 모달 composable (Modal 컴포넌트는 /report/index.vue에서만 렌더링)
const { openModal } = useModal();
const { getRandomMessage } = useRandomMessage();
const { addReport } = useReports();
const { currentGroupId } = useGroups();

const selectedCategory = ref('');
const timeInput = ref('');
const contentInput = ref('');
const textareaRef = ref(null);

const autoResize = () => {
  const el = textareaRef.value;
  if (!el) return;

  el.style.height = 'auto';
  const newHeight = Math.min(el.scrollHeight, 130);
  el.style.height = `${newHeight}px`;
  el.style.overflowY = el.scrollHeight > 130 ? 'auto' : 'hidden';

  if (!el.value.trim()) {
    el.style.padding = '10px 16px 0';
  } else {
    el.style.padding = '10px 16px';
  }
};

// 현재 시각 placeholder용 computed
const nowPlaceholder = computed(() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
});

// 폼 유효성 검사 (발생시각은 선택적)
const isFormValid = computed(() => {
  return selectedCategory.value && contentInput.value;
});

// 발생 시각 자동 포맷
const formatTime = () => {
  let v = timeInput.value.replace(/\D/g, '');
  if (v.length >= 5) v = v.replace(/(\d{4})(\d)/, '$1-$2');
  if (v.length >= 8) v = v.replace(/(\d{4}-\d{2})(\d)/, '$1-$2');
  if (v.length >= 11) v = v.replace(/(\d{4}-\d{2}-\d{2})(\d)/, '$1 $2');
  if (v.length >= 14) v = v.replace(/(\d{4}-\d{2}-\d{2} \d{2})(\d)/, '$1:$2');
  timeInput.value = v;
};

// 리포트 등록 로직
const submitReport = async () => {
  // 혹시라도 groupId가 없는 상태라면 막아주기 (이 경우는 거의 없을 예정)
  if (!currentGroupId.value) {
    openModal(
      'alert',
      '그룹이 설정되지 않았어요.',
      '그룹 ID가 없는 상태에서는 리포트를 기록할 수 없어요.'
    );
    return;
  }

  const now = new Date();

  // 등록일자 (ex: 2025-10-24 15:10)
  const registered = now.toISOString().slice(0, 16).replace('T', ' ');

  // 발생시각이 비어 있으면 현재 시각으로 대체
  const dateValue =
    timeInput.value || now.toISOString().slice(0, 16).replace('T', ' ');

  // Firestore에 저장할 리포트 객체
  const newReport = {
    groupId: currentGroupId.value, // 그룹 기준으로 묶는 핵심 필드
    category: selectedCategory.value,
    occurredAt: dateValue,
    content: contentInput.value,
    createdAt: registered,
    isOpen: false,
    isEditing: false,
    iconSrc: '/src/assets/images/open_icon.png'
  };

  try {
    await addReport(newReport);
    const message = getRandomMessage();
    openModal('alert', '리포트가 기록되었어요.', message);

    // 폼 초기화
    selectedCategory.value = '';
    timeInput.value = '';
    contentInput.value = '';
  } catch (e) {
    console.error('리포트 등록 실패:', e);
    openModal('alert', '등록 실패', '저장 중 오류가 발생했습니다.');
  }
};
</script>
