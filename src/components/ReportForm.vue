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
          @paste="handlePaste"
          @dragover.prevent
          @drop.prevent="handleDrop"
        ></textarea>
      </div>
      <!-- [추가됨] 이미지 미리보기 영역 -->
      <div class="image_preview" v-if="imagePreviews.length">
        <div
          v-for="(img, idx) in imagePreviews"
          :key="idx"
          class="preview_item"
        >
          <img :src="img.url" class="preview_img" alt="이미지 미리보기" />
          <div v-if="img.loading" class="loading_overlay">업로드 중...</div>
          <button type="button" class="remove_btn" @click="removeImage(idx)">
            <img src="@/assets/images/delete_icon.png" alt="" />
          </button>
        </div>
      </div>
      <button class="submit_btn" :disabled="!isFormValid || isUploading">
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
import { ref, computed } from 'vue';
import { useModal } from '../composables/useModal.js';
import { useRandomMessage } from '../composables/useRandomMessage.js';
import { useReports } from '../composables/useReports.js';
import { db, storage } from '../firebase/firebaseInit';
import { collection, addDoc } from 'firebase/firestore'; // [추가됨]
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'; // [추가됨]
import Modal from '../components/Modal.vue';
import CustomSelect from '../components/CustomSelect.vue';

const modal = useModal();
const { getRandomMessage } = useRandomMessage();
const { addReport } = useReports();

const selectedCategory = ref('');
const timeInput = ref('');
const contentInput = ref('');
const textareaRef = ref(null);

// [추가됨] 이미지 관련 상태
const imagePreviews = ref([]); // [{ url, loading }]
const isUploading = ref(false);

const autoResize = () => {
  const el = textareaRef.value;
  if (!el) return;

  el.style.height = 'auto';
  const newHeight = Math.min(el.scrollHeight, 130);
  el.style.height = `${newHeight}px`;
  el.style.overflowY = el.scrollHeight > 130 ? 'auto' : 'hidden';

  // 패딩 조정: 내용 없으면 아래쪽 여백 줄이기
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

// ✅ 폼 유효성 검사 (발생시각은 선택적)
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
// [추가됨] 이미지 업로드 함수
const uploadImageToStorage = async (file) => {
  const path = `reports/${Date.now()}_${file.name}`;
  const imgRef = storageRef(storage, path);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);
  return url;
};

// [수정됨] 붙여넣기 처리
const handlePaste = async (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  const uploadPromises = []; // ✅ 여러 업로드 동시 처리용 배열
  isUploading.value = true;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      const previewUrl = URL.createObjectURL(file);
      imagePreviews.value.push({ url: previewUrl, loading: true });

      const uploadPromise = (async () => {
        try {
          const uploadedUrl = await uploadImageToStorage(file);
          const idx = imagePreviews.value.findIndex(
            (p) => p.url === previewUrl
          );
          if (idx !== -1) {
            imagePreviews.value[idx].url = uploadedUrl;
            imagePreviews.value[idx].loading = false;
          }
        } catch (err) {
          console.error('이미지 업로드 실패:', err);
        }
      })();

      uploadPromises.push(uploadPromise);
    }
  }

  // ✅ 모든 업로드 완료 후에만 false로 변경
  await Promise.all(uploadPromises);
  isUploading.value = false;
};

// [수정됨] 드래그 앤 드롭 처리
const handleDrop = async (e) => {
  const files = e.dataTransfer?.files;
  if (!files) return;

  const uploadPromises = [];
  isUploading.value = true;

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      imagePreviews.value.push({ url: previewUrl, loading: true });

      const uploadPromise = (async () => {
        try {
          const uploadedUrl = await uploadImageToStorage(file);
          const idx = imagePreviews.value.findIndex(
            (p) => p.url === previewUrl
          );
          if (idx !== -1) {
            imagePreviews.value[idx].url = uploadedUrl;
            imagePreviews.value[idx].loading = false;
          }
        } catch (err) {
          console.error('이미지 업로드 실패:', err);
        }
      })();

      uploadPromises.push(uploadPromise);
    }
  }

  await Promise.all(uploadPromises);
  isUploading.value = false;
};

// [추가됨] 이미지 삭제
const removeImage = (idx) => {
  imagePreviews.value.splice(idx, 1);
};

// ✅ 리포트 등록 로직
const submitReport = async () => {
  const now = new Date();

  // 등록일자 (ex: 2025-10-24 15:10)
  const registered = now.toISOString().slice(0, 16).replace('T', ' ');

  // 발생시각이 비어 있으면 현재 시각으로 대체
  const dateValue =
    timeInput.value || now.toISOString().slice(0, 16).replace('T', ' ');

  // ✅ [추가] 실제 업로드된 URL만 추출
  const imageUrls = imagePreviews.value
    .filter((img) => !img.loading)
    .map((img) => img.url);
  // Firestore에 바로 문자열로 저장할 리포트 객체
  const newReport = {
    category: selectedCategory.value,
    occurredAt: dateValue,
    content: contentInput.value,
    createdAt: registered,
    images: imageUrls, // [추가됨]
    isOpen: false,
    isEditing: false,
    iconSrc: '/src/assets/images/open_icon.png'
  };

  try {
    await addReport(newReport); // ✅ Firestore 완료 후 모달 실행
    const message = getRandomMessage();
    modal.openModal('alert', '리포트가 기록되었어요.', message);

    // 폼 초기화
    selectedCategory.value = '';
    timeInput.value = '';
    contentInput.value = '';
    imagePreviews.value = []; // [추가됨]
  } catch (e) {
    console.error('리포트 등록 실패:', e);
    modal.openModal('alert', '등록 실패', '저장 중 오류가 발생했습니다.');
  }
};
</script>
