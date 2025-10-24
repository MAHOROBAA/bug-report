// src/composables/useReports.js
import { ref } from 'vue'

const reports = ref([]) // 전역 공유되는 리포트 리스트

export function useReports() {
  const addReport = (report) => {
    reports.value.unshift(report) // 최근 리포트가 위로 오게
  }

  const removeReport = (index) => {
    reports.value.splice(index, 1)
  }

  const updateReport = (index, updated) => {
    reports.value[index] = { ...reports.value[index], ...updated }
  }

  return { reports, addReport, removeReport, updateReport }
}
