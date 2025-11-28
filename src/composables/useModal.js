// src/composables/useModal.js
import { ref } from 'vue';

// 전역 상태 (싱글톤)
const isOpen = ref(false);
const modalType = ref('alert');
const modalTitle = ref('');
const modalMessage = ref('');

// 버튼 라벨
const okLabel = ref('확인');
const cancelLabel = ref('취소');
const confirmLabel = ref('삭제');

// 콜백
const confirmCallback = ref(null);
const cancelCallback = ref(null);

export function useModal() {
  const openModal = (type, title, message = '', options = {}) => {
    modalType.value = type;
    modalTitle.value = title;
    modalMessage.value = message;

    okLabel.value = options.okLabel || '확인';
    cancelLabel.value = options.cancelLabel || '취소';
    confirmLabel.value = options.confirmLabel || '삭제';

    confirmCallback.value = options.onConfirm || null;
    cancelCallback.value = options.onCancel || null;

    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
  };

  const confirm = () => {
    if (confirmCallback.value) {
      confirmCallback.value();
    }
    closeModal();
  };

  const cancel = () => {
    if (cancelCallback.value) {
      cancelCallback.value();
    }
    closeModal();
  };

  return {
    isOpen,
    modalType,
    modalTitle,
    modalMessage,
    okLabel,
    cancelLabel,
    confirmLabel,
    openModal,
    closeModal,
    confirm,
    cancel
  };
}
