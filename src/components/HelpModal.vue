<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>도움말</h2>

      <ol class="help_list">
        <li>자유롭게 등록/수정/삭제가 가능합니다.</li>
        <li>리포트 내용 영역에 이미지를 드래그하거나 붙여넣을 수 있습니다.</li>
        <li>모든 리포트는 익명으로 작성됩니다.</li>
        <li>카테고리 추가는 관리자에게 요청해 주세요.</li>
      </ol>

      <div class="iconinfo_wrapper">
        <div class="icon_info">🧠 펼치기</div>
        <div class="icon_info">👁️ 접기</div>
      </div>

      <button class="confirm_btn" @click="$emit('close')">확인</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

h2 {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #2b2b38;
  margin-bottom: 16px;
}

.help_list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.help_list li {
  margin-bottom: 4px;
}

.iconinfo_wrapper {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.action_btn {
  flex: 1;
  border: none;
  background: #f5f0ff;
  color: #5a25ff;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 0;
  cursor: pointer;
}

.confirm_btn {
  background: #7d4fff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  width: 100%;
  padding: 12px 0;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.confirm_btn:hover {
  opacity: 0.9;
}
</style>
