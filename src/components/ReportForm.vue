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
      <button
        class="submit_btn"
        :disabled="!isFormValid">
        기록
      </button>
    </form>
  </section>
    <!-- 모달 -->
  <Modal
    v-if="!!modal && modal.isOpen.value"
    :type="modal.modalType.value"
    :title="modal.modalTitle.value"
    :message="modal.modalMessage.value"
    @confirm="modal.confirm"
    @cancel="modal.cancel"
    @close="modal.closeModal"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useModal } from '../composables/useModal.js'
import { useRandomMessage } from '../composables/useRandomMessage.js'
import { useReports } from '../composables/useReports.js'
import Modal from '../components/Modal.vue'
import CustomSelect from '../components/CustomSelect.vue'

const modal = useModal()
const { getRandomMessage } = useRandomMessage()
const { addReport } = useReports()

const selectedCategory = ref('')
const timeInput = ref('')
const contentInput = ref('')
const textareaRef = ref(null)

const autoResize = () => {
  const el = textareaRef.value
  if (!el) return

  el.style.height = 'auto'
  const newHeight = Math.min(el.scrollHeight, 130)
  el.style.height = `${newHeight}px`
  el.style.overflowY = el.scrollHeight > 130 ? 'auto' : 'hidden'

  // 패딩 조정: 내용 없으면 아래쪽 여백 줄이기
  if (!el.value.trim()) {
    el.style.padding = '10px 16px 0'
  } else {
    el.style.padding = '10px 16px'
  }
}

// 현재 시각 placeholder용 computed
const nowPlaceholder = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
})

// ✅ 폼 유효성 검사 (발생시각은 선택적)
const isFormValid = computed(() => {
  return selectedCategory.value && contentInput.value
})

// 발생 시각 자동 포맷
const formatTime = () => {
  let v = timeInput.value.replace(/\D/g, '')
  if (v.length >= 5) v = v.replace(/(\d{4})(\d)/, '$1-$2')
  if (v.length >= 8) v = v.replace(/(\d{4}-\d{2})(\d)/, '$1-$2')
  if (v.length >= 11) v = v.replace(/(\d{4}-\d{2}-\d{2})(\d)/, '$1 $2')
  if (v.length >= 14) v = v.replace(/(\d{4}-\d{2}-\d{2} \d{2})(\d)/, '$1:$2')
  timeInput.value = v
}

// ✅ 리포트 등록 로직
const submitReport = () => {
  const now = new Date()
  const registered = now.toISOString().slice(0, 16).replace('T', ' ')

  // 발생시각이 비어 있으면 현재 시각으로 대체
  const dateValue = timeInput.value || nowPlaceholder.value

  const newReport = {
    category: selectedCategory.value,
    date: dateValue,
    content: contentInput.value,
    registered,
    isOpen: false,
    isEditing: false,
    iconSrc: '/src/assets/images/open_icon.png'
  }

  addReport(newReport)

  const message = getRandomMessage()
  modal.openModal('alert', '리포트가 기록되었어요.', message)

  // 폼 초기화
  selectedCategory.value = ''
  timeInput.value = ''
  contentInput.value = ''
}
</script>
