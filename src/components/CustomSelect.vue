<template>
  <div class="custom_select" @click="toggleSelect">
    <span :class="{ placeholder: !modelValue }">
      {{ modelValue || '선택하세요' }}
    </span>

    <ul v-if="isOpen" class="select_list">
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

const categories = [
  '😤 업무과부하',
  '😶 소통문제',
  '😩 반복실수',
  '💭 감정소진'
]

// ✅ props & emit (v-model용)
const props = defineProps({
  modelValue: { type: String, default: '' }
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
