<template>
  <section class="report_list">
    <h2 class="list_title">리포트 내역</h2>

    <!-- 검색 필터 영역 -->
    <div class="filter_row">
      <!-- 커스텀 셀렉트 -->
      <div class="form_field category_box">
        <label class="label_text">카테고리</label>
        <div class="custom_select" @click="toggleCategory">
          <span>{{ selectedCategory || '선택하세요' }}</span>
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

    <!-- 빈 상태 -->
    <p class="empty_text" v-if="!reports.length">기록된 리포트가 없습니다.</p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div v-for="(report, index) in reports" :key="index" class="report_item">
        <p class="item_category">{{ report.category }}</p>
        <p class="item_content">{{ report.content }}</p>
        <p class="item_date">{{ report.date }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const categories = ['기억손실', '말바꾸기', '황당언행', '인성확인'];

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

// 임시 데이터
const reports = ref([]);

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

<style scoped>
.report_list {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list_title {
  font-size: 18px;
  font-weight: 700;
  color: #2b2b38;
}

.filter_row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.form_field {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  min-width: 140px;
}

.label_text {
  font-size: 14px;
  font-weight: 600;
  color: #2b2b38;
}

/* 공통 인풋 스타일 */
input {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  background: #fafafa;
  color: #333;
  outline: none;
}

/* 커스텀 셀렉트 */
.custom_select {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
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

.search_btn {
  background: #b8b8b8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
  height: 40px;
}

.search_btn:hover {
  background: #9a9a9a;
}

/* 빈 상태 텍스트 */
.empty_text {
  color: #aaa;
  text-align: center;
  margin-top: 8px;
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
  .report_list {
    padding: 20px;
  }

  .filter_row {
    flex-direction: column;
    gap: 8px;
  }

  .search_btn {
    width: 100%;
  }
}
</style>
