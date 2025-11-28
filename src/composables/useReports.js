// src/composables/useReports.js
import { ref, onUnmounted, watch } from 'vue';
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
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { useGroups } from '@/composables/useGroups.js';

export function useReports() {
  // -------------------------------------------------------------
  // 상태 (이제 컴포저블 호출마다 독립)
  // -------------------------------------------------------------
  const reports = ref([]);
  const isFetched = ref(false);

  // 그룹 ID
  const { currentGroupId } = useGroups();

  // 구독 핸들
  let unsubscribe = null;

  // -------------------------------------------------------------
  // 리포트 구독 함수 (그룹 기준)
  // -------------------------------------------------------------
  const subscribeReports = (groupId) => {
    if (!groupId) return;

    // 기존 구독 해제
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    const reportsCollection = collection(db, 'reports');

    const q = query(
      reportsCollection,
      where('groupId', '==', groupId), // ✅ 그룹별 필터
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        const docs = snapshot.docs.map((d) => {
          const data = d.data();

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
            createdAt
          };
        });

        reports.value = docs;

        if (!isFetched.value && docs.length > 0) {
          isFetched.value = true;
        }

        console.log('✅ 그룹 기반 Firestore 데이터:', groupId, reports.value);
      },
      (error) => {
        console.error('Firestore 구독 오류:', error);
      }
    );
  };

  // -------------------------------------------------------------
  // groupId 변경 시 자동 재구독
  // -------------------------------------------------------------
  watch(
    currentGroupId,
    (newGroupId) => {
      // 그룹 바뀔 때마다 기존 데이터 비우고
      reports.value = [];
      isFetched.value = false;

      // 구독 정리
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      // 유효한 그룹이면 새로 구독
      if (newGroupId) {
        subscribeReports(newGroupId);
      }
    },
    { immediate: true }
  );

  // -------------------------------------------------------------
  // Firestore CRUD
  // -------------------------------------------------------------
  const addReport = async (report) => {
    try {
      const reportsCollection = collection(db, 'reports');

      const docRef = await addDoc(reportsCollection, {
        ...report,
        createdAt: serverTimestamp(),
        reactions: { '😤': 0, '😩': 0, '😐': 0, '🙂': 0, '😅': 0 }
      });

      console.log('리포트 추가 성공:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('리포트 추가 실패:', err);
      throw err;
    }
  };

  const updateReport = async (reportId, updated) => {
    try {
      const target = doc(db, 'reports', reportId);
      await updateDoc(target, updated);
      console.log('리포트 수정 성공:', reportId);
    } catch (err) {
      console.error('리포트 수정 실패:', err);
    }
  };

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
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });

  return {
    reports,
    isFetched,
    addReport,
    updateReport,
    removeReport
  };
}
