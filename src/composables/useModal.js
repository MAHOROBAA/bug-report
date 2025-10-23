import { ref } from 'vue';

const isOpen = ref(false);
const modalType = ref('alert');
const modalTitle = ref('');
const modalMessage = ref('');
const confirmCallback = ref(null);
const cancelCallback = ref(null);

export function useModal() {
  isOpen.value = false;
  modalType.value = 'alert';
  modalTitle.value = '';
  modalMessage.value = '';
  confirmCallback.value = null;
  cancelCallback.value = null;

  const openModal = (type, title, message = '', options = {}) => {
    modalType.value = type;
    modalTitle.value = title;
    modalMessage.value = message;
    confirmCallback.value = options.onConfirm || null;
    cancelCallback.value = options.onCancel || null;
    isOpen.value = true;
  };

  const closeModal = () => (isOpen.value = false);

  const confirm = () => {
    confirmCallback.value?.();
    closeModal();
  };

  const cancel = () => {
    cancelCallback.value?.();
    closeModal();
  };

  return {
    isOpen,
    modalType,
    modalTitle,
    modalMessage,
    openModal,
    closeModal,
    confirm,
    cancel
  };
}
