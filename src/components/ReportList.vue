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
    <div class="line"></div>
    <!-- 빈 상태 -->
    <p class="empty_text" v-if="!reports.length">기록된 리포트가 없습니다.</p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div v-for="(report, index) in reports" :key="index" class="report_item">
        <!-- 요약 영역 -->
        <div class="item_inner">
          <div class="item_left">
            <div
              class="item_icon"
              :class="{ open: report.isOpen }"
              @click="toggleExpand(index)"
            >
              <img
                :src="
                  report.isOpen
                    ? '/src/assets/images/close_icon.png'
                    : '/src/assets/images/open_icon.png'
                "
                :class="{ rotated: report.isOpen }"
                alt="toggle icon"
              />
            </div>
          </div>
          <div class="item_right">
            <div class="item_info">
              <div class="item_row">
                <div class="item_field">
                  <label>카테고리</label>
                  <p class="item_category">{{ report.category }}</p>
                </div>
                <div class="item_field">
                  <label>발생시각</label>
                  <p class="item_date">{{ report.date }}</p>
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
                  <p class="item_content">{{ report.content }}</p>
                  <div class="item_image">이미지 올린 것</div>
                </div>
              </div>
              <div class="item_buttons">
                <button class="btn_edit">수정</button>
                <button class="btn_delete">삭제</button>
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
    isOpen: true
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  },
  {
    category: '☣ 말바꾸기',
    date: '2025-10-21 09:10',
    content: '말을 바꾸는 패턴이 반복되어 기록함',
    registered: '2025-10-21 10:00',
    isOpen: false
  }
]);

const toggleExpand = (index) => {
  reports.value[index].isOpen = !reports.value[index].isOpen;
};

// TOP 버튼 노출 제어
const showTopBtn = ref(false);
const handleScroll = () => {
  showTopBtn.value = window.scrollY > 300;
};
onMounted(() => window.addEventListener('scroll', handleScroll));
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll));

// 스크롤 상단 이동
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 검색 기능 (추후 로직 연동 예정)
const handleSearch = () => {
  const pattern = searchDate.value ? `${searchDate.value}%` : '%';
  console.log('검색 실행:', {
    category: selectedCategory.value,
    datePattern: pattern,
    keyword: searchKeyword.value
  });
};
</script>
