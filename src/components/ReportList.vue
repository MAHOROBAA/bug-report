<template>
  <section class="report_list">
    <h2>리포트 내역</h2>
    <!-- 검색 필터 영역 -->
    <div class="filter_wrapper">
      <div class="filter_row">
        <!-- 커스텀 셀렉트 -->
        <div class="form_field category_box">
          <label class="label_text">카테고리</label>
          <CustomSelect v-model="selectedCategory" :showAll="true" />
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
    <p v-if="isLoading" class="empty_text">최근 리포트를 불러오는 중이에요{{ loadingDots }}</p>
    <p v-else-if="!filteredReports.length" class="empty_text">기록된 리포트가 없습니다.</p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div v-for="(report, index) in filteredReports" :key="report.id" class="report_item">
        <!-- 요약 영역 -->
        <div class="item_inner">
          <div class="item_left">
            <div class="item_icon" :class="{ rotating: report.isRotating }" @click="toggleExpand(report.id)">
              <transition name="fade" mode="out-in">
                <img
                  :key="report.isOpen"
                  :src="report.isOpen ? closeIcon : openIcon"
                  alt="toggle icon"
                  class="icon_img"
                />
              </transition>
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
                  <p v-if="!report.isEditing" class="item_date">{{ report.occurredAt }}</p>
                  <input
                    v-else
                    type="text"
                    v-model="report.occurredAt"
                    placeholder="YYYY-MM-DD HH:MM"
                    maxlength="16"
                  />
                </div>
              </div>
              <p class="item_registered web">
                등록일자 {{ formatDate(report.createdAt) }}
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
            <p class="item_registered mob">등록일자 {{ report.createdAt  }}</p>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import CustomSelect from '../components/CustomSelect.vue'
import Modal from '../components/Modal.vue'
import { useModal } from '../composables/useModal.js'
import { useReports } from '../composables/useReports.js'

const openIcon = new URL('@/assets/images/open_icon.png', import.meta.url).href
const closeIcon = new URL('@/assets/images/close_icon.png', import.meta.url).href

const modal = useModal()
const { reports, isFetched, removeReport, updateReport } = useReports()

// ----------------------------------------
// 로딩 관련
// ----------------------------------------
const isLoading = ref(false)
const loadingDots = ref('.')
let loadingTimer = null
let delayTimer = null

watch(isFetched, (loaded) => {
  if (!loaded) {
    // Firestore 첫 응답 전: 약간의 지연 후 로딩 시작
    delayTimer = setTimeout(() => {
      isLoading.value = true
      loadingTimer = setInterval(() => {
        loadingDots.value =
          loadingDots.value.length < 3 ? loadingDots.value + '.' : '.'
      }, 500)
    }, 600)
  } else {
    // Firestore 응답 도착 → 로딩 종료
    clearTimeout(delayTimer)
    isLoading.value = false
    clearInterval(loadingTimer)
  }
})

onBeforeUnmount(() => {
  clearTimeout(delayTimer)
  clearInterval(loadingTimer)
})

// ----------------------------------------
// 검색 관련
// ----------------------------------------
const selectedCategory = ref('')
const searchDate = ref('')
const searchKeyword = ref('')

const isSearchEnabled = computed(() => {
  return (
    selectedCategory.value ||
    searchDate.value.trim() ||
    searchKeyword.value.trim()
  )
})

const filterDateFormat = () => {
  searchDate.value = searchDate.value.replace(/[^\d]/g, '').substring(0, 8)
}

const filteredReports = computed(() => {
  return reports.value.filter((r) => {
    const matchCategory =
      !selectedCategory.value || r.category === selectedCategory.value
    const matchDate =
      !searchDate.value ||
      (r.occurredAt &&
        r.occurredAt.replace(/[-:\s]/g, '').includes(searchDate.value))
    const matchKeyword =
      !searchKeyword.value ||
      (r.content &&
        r.content.toLowerCase().includes(searchKeyword.value.toLowerCase()))
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

// ----------------------------------------
// 리스트 조작 (열기/수정/삭제)
// ----------------------------------------
const toggleExpand = (id) => {
  const target = reports.value.find((r) => r.id === id)
  if (!target) return
  target.isRotating = true
  setTimeout(() => (target.isOpen = !target.isOpen), 300)
  setTimeout(() => (target.isRotating = false), 600)
}

const editReport = (index) => {
  reports.value[index].isEditing = true
}

const saveReport = async (index) => {
  const report = reports.value[index]
  report.isEditing = false

  try {
    await updateReport(report.id, {
      category: report.category,
      occurredAt: report.occurredAt,
      content: report.content,
      createdAt: report.createdAt
    })
    modal.openModal('alert', '수정 완료', '수정이 완료되었습니다.')
  } catch (e) {
    console.error('수정 오류:', e)
    modal.openModal('alert', '수정 실패', '업데이트 중 오류가 발생했습니다.')
  }
}

const deleteReport = (index) => {
  const report = reports.value[index]
  modal.openModal('confirm', '리포트 삭제', '삭제하시겠어요?', {
    onConfirm: async () => {
      try {
        await removeReport(report.id)
        await new Promise((r) => setTimeout(r, 300))
        modal.openModal('alert', '삭제 완료', '리포트가 삭제되었습니다.')
      } catch (e) {
        console.error('삭제 중 오류:', e)
        modal.openModal('alert', '삭제 실패', '삭제 중 오류가 발생했습니다.')
      }
    }
  })
}
// ----------------------------------------
// 날짜 포맷 변환용 헬퍼 함수 (Timestamp 대응)
// ----------------------------------------
const formatDate = (date) => {
  if (!date) return '-'
  try {
    // Firestore Timestamp 객체인 경우
    if (typeof date.toDate === 'function') {
      return date.toDate().toLocaleString('ko-KR', { hour12: false })
    }
    // 문자열일 경우 그대로 반환
    return date
  } catch (e) {
    console.error('날짜 변환 오류:', e)
    return '-'
  }
}

// ----------------------------------------
// Top 버튼
// ----------------------------------------
const showTopBtn = ref(false)
const handleScroll = () => {
  showTopBtn.value = window.scrollY > 300
}
onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
