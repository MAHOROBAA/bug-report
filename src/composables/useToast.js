// src/composables/useToast.js
import { ref } from 'vue';

const toasts = ref([]);
let id = 0;

export function useToast() {
  const showToast = (message, duration = 2000) => {
    const toastId = ++id;
    toasts.value.push({ id: toastId, message });

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId);
    }, duration);
  };

  return {
    toasts,
    showToast
  };
}
