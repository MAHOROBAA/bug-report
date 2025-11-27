// src/composables/useGroups.js
import { ref } from 'vue';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { useAuth } from '@/composables/useAuth';

const currentGroupId = ref(null);
const currentGroup = ref(null);

export function useGroups() {
  const { currentUser } = useAuth();

  // 현재 로그인 유저의 groupId 가져오기
  const loadUserGroup = async () => {
    if (!currentUser.value) {
      currentGroupId.value = null;
      currentGroup.value = null;
      return;
    }

    const userRef = doc(db, 'users', currentUser.value.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      currentGroupId.value = null;
      currentGroup.value = null;
      return;
    }

    const data = snap.data();
    currentGroupId.value = data.groupId ?? null;

    if (data.groupId) {
      const groupRef = doc(db, 'groups', data.groupId);
      const groupSnap = await getDoc(groupRef);

      currentGroup.value = groupSnap.exists()
        ? { id: groupSnap.id, ...groupSnap.data() }
        : null;
    } else {
      currentGroup.value = null;
    }
  };

  // 그룹 생성
  const createGroup = async (groupId) => {
    if (!currentUser.value) {
      throw new Error('로그인이 필요합니다.');
    }

    const normalizedId = groupId.trim().toLowerCase();

    if (!/^[a-z0-9]+$/.test(normalizedId)) {
      throw new Error('그룹 ID는 영문과 숫자만 사용할 수 있습니다.');
    }

    const groupRef = doc(db, 'groups', normalizedId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      throw new Error('이미 존재하는 그룹 ID입니다.');
    }

    // 그룹 문서 생성
    await setDoc(groupRef, {
      createdByUid: currentUser.value.uid,
      createdAt: serverTimestamp(),
    });

    // 그룹 멤버 등록 (owner)
    const memberRef = doc(
      db,
      'groups',
      normalizedId,
      'members',
      currentUser.value.uid
    );

    await setDoc(memberRef, {
      role: 'owner',
      joinedAt: serverTimestamp(),
    });

    // 유저 문서에 groupId 연결
    const userRef = doc(db, 'users', currentUser.value.uid);
    await setDoc(
      userRef,
      {
        groupId: normalizedId,
      },
      { merge: true }
    );

    currentGroupId.value = normalizedId;
    await loadUserGroup();
  };

  // 그룹 참가
  const joinGroup = async (groupId) => {
    if (!currentUser.value) {
      throw new Error('로그인이 필요합니다.');
    }

    const normalizedId = groupId.trim().toLowerCase();

    if (!/^[a-z0-9]+$/.test(normalizedId)) {
      throw new Error('그룹 ID는 영문과 숫자만 사용할 수 있습니다.');
    }

    const groupRef = doc(db, 'groups', normalizedId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error('해당 그룹 ID가 존재하지 않습니다.');
    }

    // 그룹 멤버 추가
    const memberRef = doc(
      db,
      'groups',
      normalizedId,
      'members',
      currentUser.value.uid
    );

    await setDoc(memberRef, {
      role: 'member',
      joinedAt: serverTimestamp(),
    });

    // 유저 문서에 groupId 저장
    const userRef = doc(db, 'users', currentUser.value.uid);
    await setDoc(
      userRef,
      {
        groupId: normalizedId,
      },
      { merge: true }
    );

    currentGroupId.value = normalizedId;
    await loadUserGroup();
  };

  return {
    currentGroupId,
    currentGroup,
    loadUserGroup,
    createGroup,
    joinGroup,
  };
}
