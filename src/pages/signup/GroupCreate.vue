<template>
  <div class="groupcreate_wrapper">
    <p class="title">BUG REPORT</p>

    <div class="groupid_wrapper">
      <p>
        그룹 ID를 설정하세요.<br />
        다른 팀원이 입력할 ID입니다.
      </p>

      <div class="filter_row">
        <div class="form_field">
          <input
            type="text"
            placeholder="영문+숫자로만 입력"
            v-model="groupIdInput"
          />
        </div>

        <button class="confirm_btn" @click="checkDuplicate">
          중복 검사
        </button>
      </div>

      <button class="submit_btn" @click="handleCreateGroup">
        그룹 ID 생성
      </button>
    </div>

    <p class="back" @click="goBack">뒤로</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { useGroups } from '@/composables/useGroups';

const router = useRouter();
const { currentGroupId, loadUserGroup, createGroup } = useGroups();

const groupIdInput = ref('');
const isChecked = ref(false);

// 이미 groupId를 가진 유저는 접근 못 하게
onMounted(async () => {
  await loadUserGroup();

  if (currentGroupId.value) {
    router.push('/report');
  }
});

// =====================
// 중복 검사
// =====================
const checkDuplicate = async () => {
  const value = groupIdInput.value.trim().toLowerCase();

  if (!value) {
    window.alert('그룹 ID를 입력해 주세요.');
    return;
  }

  if (!/^[a-z0-9]+$/.test(value)) {
    window.alert('영문과 숫자만 사용할 수 있습니다.');
    return;
  }

  try {
    const groupRef = doc(db, 'groups', value);
    const snap = await getDoc(groupRef);

    if (snap.exists()) {
      window.alert('이미 존재하는 그룹 ID입니다.');
      isChecked.value = false;
    } else {
      window.alert('사용 가능한 그룹 ID입니다.');
      isChecked.value = true;
    }
  } catch (error) {
    console.error('duplicate check error:', error);
    window.alert('중복 검사 중 오류가 발생했습니다.');
  }
};

// =====================
// 그룹 생성
// =====================
const handleCreateGroup = async () => {
  const value = groupIdInput.value.trim().toLowerCase();

  if (!value) {
    window.alert('그룹 ID를 입력해 주세요.');
    return;
  }

  if (!isChecked.value) {
    window.alert('먼저 중복 검사를 진행해 주세요.');
    return;
  }

  try {
    await createGroup(value);
    router.push('/report');
  } catch (error) {
    console.error('createGroup error:', error);
    window.alert(error.message || '그룹 생성에 실패했습니다.');
  }
};

// =====================
// 뒤로가기
// =====================
const goBack = () => {
  router.push('/signup/groupjoin');
};
</script>
