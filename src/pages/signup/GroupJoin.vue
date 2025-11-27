<template>
  <div class="groupjoin_wrapper">
    <p class="title">BUG REPORT</p>

    <div class="groupid_wrapper">
      <div class="form_field">
        <input
          type="text"
          placeholder="그룹 ID를 입력해 주세요."
          v-model="groupIdInput"
          @keyup.enter="handleJoinGroup"
        />
      </div>
      <button class="submit_btn" @click="handleJoinGroup">
        그룹 참여하기
      </button>
    </div>

    <div class="groupidcreate_wrapper">
      <p>처음 이용하신다면 그룹 ID 생성이 필요해요.</p>
      <button class="btn_secondary" @click="goToGroupCreate">
        그룹 ID 생성하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGroups } from '@/composables/useGroups';

const router = useRouter();
const {
  currentGroupId,
  loadUserGroup,
  joinGroup
} = useGroups();

const groupIdInput = ref('');

// 이미 그룹이 있는 유저가 이 화면에 들어오면 바로 리포트로 보냄
onMounted(async () => {
  await loadUserGroup();

  if (currentGroupId.value) {
    router.push('/report'); // 실제 리포트 경로에 맞게 수정 가능
  }
});

const handleJoinGroup = async () => {
  const value = groupIdInput.value.trim();

  if (!value) {
    window.alert('그룹 ID를 입력해 주세요.');
    return;
  }

  try {
    await joinGroup(value);
    router.push('/report');
  } catch (error) {
    console.error('joinGroup error:', error);
    window.alert(error.message || '그룹 참여에 실패했어요. 다시 시도해 주세요.');
  }
};

const goToGroupCreate = () => {
  // 그룹 생성 화면으로 이동 (GroupCreate.vue가 연결된 경로)
  router.push('/signup/groupcreate');
};
</script>
