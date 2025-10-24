<template>
  <section class="report_list">
    <h2>리포트 내역</h2>
    <!-- 검색 필터 영역 -->
    <div class="filter_wrapper">
      <div class="filter_row">
        <!-- 커스텀 셀렉트 -->
        <div class="form_field category_box">
          <label class="label_text">카테고리</label>
          <CustomSelect v-model="selectedCategory" />
        </div>
        <!-- 발생일 -->
        <div class="form_field">
          <label class="label_text" for="searchDate">발생일</label>
          <input
            id="searchDate"
            type="text"
            v-model="searchDate"
            placeholder="YYYYMMDD"
            maxlength="8"
            @input="filterDateFormat"
          />
        </div>
      </div>
      <div class="filter_row">
        <!-- 검색어 -->
        <div class="form_field">
          <label class="label_text" for="searchKeyword">검색어</label>
          <input
            id="searchKeyword"
            type="text"
            v-model="searchKeyword"
            placeholder="검색어를 입력하세요"
          />
        </div>
        <!-- 검색 버튼 -->
        <button class="search_btn"
          :disabled="!isSearchEnabled"
          @click="handleSearch">검색</button>
      </div>
    </div>
    <div class="line"></div>
    <!-- 빈 상태 -->
    <p class="empty_text" v-if="!filteredReports.length">기록된 리포트가 없습니다.</p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div v-for="(report, index) in filteredReports" :key="index" class="report_item">
        <!-- 요약 영역 -->
        <div class="item_inner">
          <div class="item_left">
            <div
              class="item_icon"
              :class="{ open: report.isOpen }"
              @click="toggleExpand(index)"
            >
              <img :src="report.iconSrc" alt="toggle icon" />
            </div>
          </div>
          <div class="item_right">
            <div class="item_info">
              <div class="item_row">
                <div class="item_field">
                  <label>카테고리</label>
                  <p v-if="!report.isEditing" class="item_category">{{ report.category }}</p>
                  <CustomSelect
                    v-else
                    v-model="report.category"
                    class="edit_select"
                  />
                </div>
                <div class="item_field">
                  <label>발생시각</label>
                  <p v-if="!report.isEditing" class="item_date">{{ report.date }}</p>
                  <input
                    v-else
                    type="text"
                    v-model="report.date"
                    placeholder="YYYY-MM-DD HH:MM"
                    maxlength="16"
                  />
                </div>
              </div>
              <p class="item_registered web">
                등록일자 {{ report.registered }}
              </p>
            </div>
            <!-- 펼침 영역 -->
            <div v-if="report.isOpen" class="item_detail">
              <div class="item_field">
                <label>리포트</label>
                <div class="item_contents">
                  <p v-if="!report.isEditing" class="item_content">{{ report.content }}</p>
                  <textarea
                    v-else
                    v-model="report.content"
                    class="edit_textarea"
                    rows="3"
                  />
                </div>
              </div>
              <div class="item_buttons">
                <button class="btn_edit"
                @click="report.isEditing ? saveReport(index) : editReport(index)">{{ report.isEditing ? '저장' : '수정' }}</button>
                <button class="btn_delete" @click="deleteReport(index)">삭제</button>
              </div>
            </div>
            <p class="item_registered mob">등록일자 {{ report.registered }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 버튼 -->
    <button class="btn_top" @click="scrollToTop" v-show="showTopBtn">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1904_442)">
          <path
            d="M20 5C32 5 35 8 35 20C35 32 32 35 20 35C8 35 5 32 5 20C5 8 8 5 20 5Z"
            fill="#6000B4"
            fill-opacity="0.1"
            stroke="#6000B4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 21.6666L20 16.6666L25 21.6666"
            stroke="#6000B4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1904_442">
            <rect width="40" height="40" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CustomSelect from '../components/CustomSelect.vue'
import Modal from '../components/Modal.vue'
import { useModal } from '../composables/useModal.js'
import { useReports } from '../composables/useReports.js'

const modal = useModal()
const { reports, removeReport } = useReports()

// 커스텀 셀렉트
const selectedCategory = ref('')

// 검색 필드
const searchDate = ref('')
const searchKeyword = ref('')

// 검색 버튼 활성화 조건
const isSearchEnabled = computed(() => {
  return (
    selectedCategory.value ||
    searchDate.value.trim() ||
    searchKeyword.value.trim()
  )
})

// 날짜 숫자만 받기
const filterDateFormat = () => {
  searchDate.value = searchDate.value.replace(/\D/g, '').slice(0, 8)
}

// 검색 로직
const filteredReports = computed(() => {
  return reports.value.filter((r) => {
    const matchCategory =
      !selectedCategory.value || r.category === selectedCategory.value
    const matchDate =
      !searchDate.value || r.date.replace(/-/g, '').includes(searchDate.value)
    const matchKeyword =
      !searchKeyword.value ||
      r.content.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchCategory && matchDate && matchKeyword
  })
})

const handleSearch = () => {
  console.log('검색 실행:', {
    category: selectedCategory.value,
    date: searchDate.value,
    keyword: searchKeyword.value
  })
}

// 펼침 아이콘 전환
const toggleExpand = (index) => {
  const report = reports.value[index]
  const img = document.querySelectorAll('.item_icon img')[index]

  report.isOpen = !report.isOpen

  img.classList.remove('rotated', 'unrotated', 'fade')
  void img.offsetWidth
  img.classList.add(report.isOpen ? 'rotated' : 'unrotated')

  img.classList.add('fade-out')
  setTimeout(() => {
    report.iconSrc = report.isOpen
      ? '/src/assets/images/close_icon.png'
      : '/src/assets/images/open_icon.png'
    img.classList.remove('fade-out')
    img.classList.add('fade-in')
  }, 400)

  setTimeout(() => {
    img.classList.remove('fade-in')
  }, 800)
}

// 수정 기능
const editReport = (index) => {
  reports.value[index].isEditing = true
}

const saveReport = (index) => {
  reports.value[index].isEditing = false
  modal.openModal('alert', '수정 완료', '수정이 완료되었습니다.')
}

// 삭제 기능
const deleteReport = (index) => {
  const report = reports.value[index]
  modal.openModal('confirm', '리포트 삭제', '삭제하시겠어요?', {
    onConfirm: () => {
      reports.value.splice(index, 1)
      modal.openModal('alert', '삭제 완료', '리포트가 삭제되었습니다.')
    }
  })
}

// TOP 버튼
const showTopBtn = ref(false)
const handleScroll = () => {
  showTopBtn.value = window.scrollY > 300
}
onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
