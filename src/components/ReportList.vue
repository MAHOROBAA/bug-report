<template>
  <section class="report_list">
    <h2>리포트 내역</h2>
    <!-- 검색 필터 영역 -->
    <div class="filter_wrapper">
      <div class="filter_row">
        <!-- 커스텀 셀렉트 -->
        <div class="form_field category_box">
          <label class="label_text">카테고리</label>
          <div class="custom_select" @click="toggleCategory">
            <span>{{ selectedCategory || '선택하세요' }}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.747 7.62646L10 12.3735L5.25298 7.62646" stroke="#A6ABBA" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <ul v-if="isCategoryOpen" class="select_list">
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
        <button class="search_btn" @click="handleSearch">검색</button>
      </div>
    </div>
    <div class="line"> </div>
    <!-- 빈 상태 -->
    <p class="empty_text" v-if="!reports.length">기록된 리포트가 없습니다.</p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div
        v-for="(report, index) in reports"
        :key="index"
        class="report_item"
      >
        <!-- 요약 영역 -->
        <div class="item_header" @click="toggleExpand(index)">
          <div class="item_left">
            <div class="item_icon" :class="{ open: report.isOpen }">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1904_414)">
                  <path d="M11.75 2.12329L11.791 2.12529L11.999 2.12829C14.0335 2.19168 15.9674 3.02822 17.4067 4.46756C18.8461 5.90689 19.6826 7.84075 19.746 9.87529L19.749 10.1233L19.926 10.1293C20.6596 10.1724 21.3519 10.4832 21.8715 11.0028C22.3911 11.5224 22.7019 12.2147 22.745 12.9483L22.75 13.1243C22.75 13.9199 22.4339 14.683 21.8713 15.2456C21.3087 15.8082 20.5456 16.1243 19.75 16.1243L19.749 17.8203L21.582 20.5703C21.677 20.713 21.7338 20.8777 21.7468 21.0486C21.7598 21.2195 21.7287 21.3909 21.6564 21.5463C21.5841 21.7018 21.4731 21.836 21.334 21.9362C21.1949 22.0363 21.0323 22.099 20.862 22.1183L20.75 22.1243H10.75C7.305 22.1263 4.423 19.6343 3.849 16.3003L3.821 16.1223L3.75 16.1233C2.98479 16.1233 2.24849 15.831 1.69174 15.306C1.13499 14.781 0.799892 14.0632 0.755 13.2993L0.75 13.1243C0.75 12.3286 1.06607 11.5656 1.62868 11.003C2.19129 10.4404 2.95435 10.1243 3.75 10.1243L3.754 9.87429C3.81895 7.79688 4.68985 5.82629 6.1823 4.37976C7.67474 2.93323 9.67157 2.12432 11.75 2.12429V2.12329ZM11.75 12.1243C11.2196 12.1243 10.7109 12.335 10.3358 12.7101C9.96071 13.0852 9.75 13.5939 9.75 14.1243C9.75 14.3895 9.85536 14.6439 10.0429 14.8314C10.2304 15.0189 10.4848 15.1243 10.75 15.1243H12.75C13.0152 15.1243 13.2696 15.0189 13.4571 14.8314C13.6446 14.6439 13.75 14.3895 13.75 14.1243C13.75 13.5939 13.5393 13.0852 13.1642 12.7101C12.7891 12.335 12.2804 12.1243 11.75 12.1243ZM9.76 8.12429L9.633 8.13129C9.3799 8.16139 9.14785 8.28701 8.98426 8.48246C8.82067 8.67791 8.73789 8.92845 8.75283 9.1829C8.76776 9.43734 8.8793 9.67647 9.06463 9.85144C9.24997 10.0264 9.49512 10.124 9.75 10.1243L9.877 10.1173C10.1301 10.0872 10.3621 9.96158 10.5257 9.76612C10.6893 9.57067 10.7721 9.32013 10.7572 9.06569C10.7422 8.81124 10.6307 8.57211 10.4454 8.39714C10.26 8.22217 10.0149 8.12457 9.76 8.12429ZM13.76 8.12429L13.633 8.13129C13.3799 8.16139 13.1479 8.28701 12.9843 8.48246C12.8207 8.67791 12.7379 8.92845 12.7528 9.1829C12.7678 9.43734 12.8793 9.67647 13.0646 9.85144C13.25 10.0264 13.4951 10.124 13.75 10.1243L13.877 10.1173C14.1301 10.0872 14.3621 9.96158 14.5257 9.76612C14.6893 9.57067 14.7721 9.32013 14.7572 9.06569C14.7422 8.81124 14.6307 8.57211 14.4454 8.39714C14.26 8.22217 14.0149 8.12457 13.76 8.12429Z" fill="url(#paint0_linear_1904_414)"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_1904_414" x1="0.75" y1="2.12329" x2="24.5459" y2="19.6918" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6000B4"/>
                    <stop offset="1" stop-color="#006192"/>
                  </linearGradient>
                  <clipPath id="clip0_1904_414">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

            </div>
            <div class="item_info">
              <p class="item_category">{{ report.category }}</p>
              <p class="item_date">{{ report.date }}</p>
            </div>
          </div>
        </div>

        <!-- 펼침 영역 -->
        <div v-if="report.isOpen" class="item_detail">
          <p class="item_content">{{ report.content }}</p>

          <div class="item_image">이미지 올린 것</div>

          <p class="item_registered">등록일자 {{ report.registered }}</p>

          <div class="item_buttons">
            <button class="btn_edit">수정</button>
            <button class="btn_delete">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 버튼 -->
    <button class="btn_top" @click="scrollToTop" v-show="showTopBtn">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1904_442)">
          <path d="M20 5C32 5 35 8 35 20C35 32 32 35 20 35C8 35 5 32 5 20C5 8 8 5 20 5Z" fill="#6000B4" fill-opacity="0.1" stroke="#6000B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 21.6666L20 16.6666L25 21.6666" stroke="#6000B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_1904_442">
            <rect width="40" height="40" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const categories = ['❓ 기억손실', '☣ 말바꾸기', '🤯 황당언행', '💫 인성확인'];

// 커스텀 셀렉트 관련
const isCategoryOpen = ref(false);
const selectedCategory = ref('');

const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};

const selectCategory = (item) => {
  selectedCategory.value = item;
  isCategoryOpen.value = false;
};

// 검색 필드
const searchDate = ref('');
const searchKeyword = ref('');

// 날짜 숫자만 받기
const filterDateFormat = () => {
  searchDate.value = searchDate.value.replace(/\D/g, '').slice(0, 8);
};


const reports = ref([
  {
    category: '❓ 기억손실',
    date: '2025-10-22 10:34',
    content:
      '리포트 내용 리포트 내용 리포트 내용 리포트 내용 리포트 내용 리포트 내용 리포트 내용 리포트 내용 리포트 내용',
    registered: '2025-10-22 12:34',
    isOpen: true,
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false,
  },
])

const toggleExpand = (index) => {
  reports.value[index].isOpen = !reports.value[index].isOpen
}

// TOP 버튼 노출 제어
const showTopBtn = ref(false)
const handleScroll = () => {
  showTopBtn.value = window.scrollY > 300
}
onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))

// 스크롤 상단 이동
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 검색 기능 (추후 로직 연동 예정)
const handleSearch = () => {
  const pattern = searchDate.value ? `${searchDate.value}%` : '%';
  console.log('검색 실행:', {
    category: selectedCategory.value,
    datePattern: pattern,
    keyword: searchKeyword.value,
  });
};
</script>

<style scoped>
h2 {
  font-size: 20px;
  font-weight: 700;
}
.report_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter_wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter_row {
  display: flex;
  align-items: flex-end;
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
  border: 1px solid #EFF1F5;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background: #fff;
  outline: none;
}

input::placeholder {
  color: #BDC2CF;
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
  border: 1px solid #EFF1F5;
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

.search_btn {
  color: #F8F9FB;
  border: none;
  border-radius: 8px;
  background: linear-gradient(124deg, #6000B4 0%, #006192 100%);
  width: 86px;
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

.search_btn:hover {
  background: #9a9a9a;
}

.search_btn:disabled {
  background: #BDC1CF;
}

.line {
  height: 1px;
  width: calc(100% - 40px);
  margin: 6px auto;
  border-bottom: 1px solid #EFF1F5;
}

/* 빈 상태 텍스트 */
.empty_text {
  color: #BDC1CF;
  text-align: center;
  margin: 0;
}

/* 리스트 */
.report_items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report_item {
  padding: 16px;
  background: #f6f0ff;
  border-radius: 12px;
}

.item_category {
  font-weight: 700;
  font-size: 14px;
  color: #5a25ff;
  margin-bottom: 4px;
}

.item_content {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.item_date {
  font-size: 12px;
  color: #888;
}

/* 모바일 대응 */
@media (max-width: 430px) {
  .filter_wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .line {
  width: calc(100% - 30px);
}
}
</style>
