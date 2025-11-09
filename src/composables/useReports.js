// src/composables/useReports.js
import { ref, onUnmounted } from 'vue';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
console.log('db 확인:', db);
// -------------------------------------------------------------
// 상태
// -------------------------------------------------------------
const reports = ref([]); // 리포트 목록
const isFetched = ref(false); // 첫 데이터 수신 여부 (로딩 제어용)

// -------------------------------------------------------------
// Firestore 컬렉션 참조 + 쿼리 정의
// -------------------------------------------------------------
const reportsCollection = collection(db, 'reports');
const q = query(reportsCollection, orderBy('createdAt', 'desc'), limit(20));

// -------------------------------------------------------------
// 실시간 구독 (최초 로딩 타이밍 문제 해결 포함)
// -------------------------------------------------------------
const unsubscribe = onSnapshot(
  q,
  { includeMetadataChanges: true },
  (snapshot) => {
    const docs = snapshot.docs.map((d) => {
      const data = d.data();

      // createdAt이 Timestamp라면 문자열로 변환
      let createdAt = data.createdAt;
      if (createdAt && createdAt.seconds) {
        const date = new Date(createdAt.seconds * 1000);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        createdAt = `${y}-${m}-${day} ${h}:${min}`;
      }

      return {
        id: d.id,
        ...data,
        images: data.images || [],
        createdAt // 변환된 문자열 저장
      };
    });

    reports.value = docs;

    if (!isFetched.value && docs.length > 0) {
      isFetched.value = true;
    }

    console.log('Firestore 데이터:', reports.value);
  },
  (error) => {
    console.error('Firestore 구독 오류:', error);
  }
);

// -------------------------------------------------------------
// Firestore CRUD
// -------------------------------------------------------------

// 추가
const addReport = async (report) => {
  try {
    const docRef = await addDoc(reportsCollection, {
      ...report,
      createdAt: serverTimestamp(),
      reactions: { '😤': 0, '😩': 0, '😐': 0, '🙂': 0, '😅': 0 }
    });
    console.log('리포트 추가 성공:', docRef.id);
    return docRef.id; // ✅ 추가됨: 정상 종료 신호
  } catch (err) {
    console.error('리포트 추가 실패:', err);
    throw err; // ✅ catch에서 다시 던져야 ReportForm에서 catch로 감
  }
};

// 수정
const updateReport = async (reportId, updated) => {
  try {
    const target = doc(db, 'reports', reportId);
    await updateDoc(target, updated);
    console.log('리포트 수정 성공:', reportId);
  } catch (err) {
    console.error('리포트 수정 실패:', err);
  }
};

// 삭제
const removeReport = async (reportId) => {
  try {
    const target = doc(db, 'reports', reportId);
    await deleteDoc(target);
    console.log('리포트 삭제 성공:', reportId);
  } catch (err) {
    console.error('리포트 삭제 실패:', err);
  }
};

// -------------------------------------------------------------
// 구독 종료 처리
// -------------------------------------------------------------
onUnmounted(() => unsubscribe());

// -------------------------------------------------------------
// export
// -------------------------------------------------------------
export function useReports() {
  return {
    reports,
    isFetched, // Firestore 로딩 완료 여부
    addReport,
    updateReport,
    removeReport,
    unsubscribe
  };
}
