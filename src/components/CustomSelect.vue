<template>
  <div class="custom_select" @click="toggleSelect">
    <span :class="{ placeholder: !modelValue }">
      {{ modelValue || '선택하세요' }}
    </span>

    <ul v-if="isOpen" class="select_list">
      <!-- showAll이 true일 때만 '전체' 항목 추가 -->
      <li
        v-if="showAll"
        @click.stop="selectItem('')"
        class="all_option"
      >
        전체
      </li>
      <li
        v-for="(item, idx) in categories"
        :key="idx"
        @click.stop="selectItem(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ✅ 내부 카테고리 고정
const categories = [
  '❓ 기억손실',
  '☣ 말바꾸기',
  '🤯 황당언행',
  '💫 인성확인'
]

// ✅ props & emit (v-model용)
const props = defineProps({
  modelValue: { type: String, default: '' },
  showAll: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

// ✅ 상태
const isOpen = ref(false)

// ✅ 동작
const toggleSelect = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item) => {
  emit('update:modelValue', item)
  isOpen.value = false
}
</script>
