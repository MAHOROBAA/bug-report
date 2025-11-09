<template>
  <div class="terms_modal">
    <Header
      title="서비스 이용 약관"
      leftIcon="close"
      @left-action="closeTerms"
    />
    <div class="terms_wrapper" :class="{ nofooter: !showAgree }">
      <div class="terms_inner">
        <p class="termtitle">제1조 (목적)</p>
        <p class="termscript">
          이 약관은 이용자가 버그 리포트(Bug Report) 서비스를 이용함에 있어,
          서비스 제공자(이하 "운영자")와 이용자 간의 권리, 의무 및 책임사항을
          규정함을 목적으로 합니다.<br />
          버그 리포트는 직장 내 부당하거나 불합리한 상황을 기록하고
          공유함으로써, 개인의 스트레스 완화와 정신적 건강 회복을 돕기 위한
          비상업적 기록 서비스입니다.
        </p>
        <p class="termtitle">제2조 (정의)</p>
        <p class="termscript">
          “서비스”란 이용자가 웹 또는 모바일 환경에서 접속하여 리포트를 작성,
          열람, 관리할 수 있도록 운영자가 제공하는 모든 기능을 말합니다.<br />
          “이용자”란 본 약관에 동의하고 서비스를 이용하는 개인을 의미합니다.<br />
          “그룹 ID”란 동일 조직이나 팀 단위로 리포트를 공유하기 위해 이용자가
          설정한 고유 식별 코드를 의미합니다.
        </p>
        <p class="termtitle">제3조 (서비스의 성격)</p>
        <p class="termscript">
          버그 리포트는 심리적 기록과 공유를 위한 플랫폼으로, 법적 신고나
          고소·고발 절차를 대체하지 않습니다.<br />
          본 서비스는 이용자가 작성한 내용을 자동 저장 및 공유할 뿐, 내용의 사실
          여부를 검증하지 않습니다.<br />
          운영자는 이용자가 작성한 리포트의 내용에 대해 어떠한 법적 책임도 지지
          않습니다.
        </p>
        <p class="termtitle">제4조 (이용자의 의무)</p>
        <p class="termscript">
          이용자는 타인의 명예를 훼손하거나 모욕하는 표현, 개인정보 또는 사적인
          정보를 무단으로 게시해서는 안 됩니다.<br />
          이용자는 리포트 작성 시 사실에 기반한 표현을 권장하되, 허위 사실
          유포나 비방 목적의 사용을 금합니다.<br />
          위 조항을 위반할 경우 운영자는 해당 리포트를 삭제하거나 서비스 이용을
          제한할 수 있습니다.
        </p>
        <p class="termtitle">제5조 (운영자의 의무 및 면책)</p>
        <p class="termscript">
          운영자는 안정적인 서비스 제공을 위해 최선을 다하지만, 천재지변, 시스템
          장애, 외부 서비스 오류(Firebase, Google 등)로 인한 손해에 대해서는
          책임을 지지 않습니다.<br />
          운영자는 이용자가 작성한 리포트의 내용, 표현, 사실관계 등에 대해
          어떠한 법적 책임도 지지 않으며,<br />
          서비스 내 게시된 정보가 외부에서 사용됨으로 인해 발생하는 분쟁, 손해,
          명예훼손, 불이익 등에 대해서도 책임을 지지 않습니다.<br />
          본 서비스는 법률적 자문, 고충처리, 노무상담 등을 제공하지 않습니다.<br />
          해당 목적의 조언이 필요한 경우, 이용자는 전문 기관 또는 공공기관을
          이용해야 합니다.
        </p>
        <p class="termtitle">제6조 (개인정보 보호)</p>
        <p class="termscript">
          서비스는 로그인 및 데이터 동기화를 위해 Google 계정을 사용합니다.<br />
          이용자의 Google 계정 정보는 Firebase Authentication 및 Firestore
          상에서 안전하게 관리되며,<br />
          운영자는 이용자의 동의 없이 제3자에게 제공하지 않습니다.
        </p>
        <p class="termtitle">제7조 (서비스 이용의 제한)</p>
        <p class="termscript">
          운영자는 다음 각 호에 해당하는 경우 이용자의 서비스 이용을 제한하거나
          계정을 삭제할 수 있습니다.<br />
          • 타인의 개인정보 도용 또는 무단 공유<br />
          • 욕설, 모욕, 비방 등 타인을 불쾌하게 하는 표현<br />
          • 서비스 목적에 반하는 상업적 광고, 홍보, 모집 행위<br />
          • 법령 또는 공공질서에 위반되는 행위
        </p>
        <p class="termtitle">제8조 (약관의 변경)</p>
        <p class="termscript">
          운영자는 필요한 경우 본 약관을 개정할 수 있으며, 변경된 약관은 서비스
          화면에 공지한 시점부터 효력이 발생합니다.<br />
          이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수
          있습니다.
        </p>
        <p class="termtitle">제9조 (준거법 및 관할)</p>
        <p class="termscript">
          본 약관은 대한민국 법률에 따르며, 서비스 이용과 관련하여 분쟁이 발생한
          경우 서울중앙지방법원을 전속 관할로 합니다.
        </p>
      </div>
      <div v-if="showAgree" class="termagree_wrapper">
        <p class="terminfo">약관을 읽고 동의 하신다면 다음을 눌러 주세요.</p>
        <div class="modal_buttons type_confirm">
          <button class="btn_cancel">뒤로</button>
          <button class="btn_confirm">다음</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from '@/components/Header.vue';

// 마이페이지에서 열릴 땐 ‘닫기 모드’로 동작하게 함
const props = defineProps({
  showAgree: { type: Boolean, default: true } // 기본은 약관 동의용 모달
});
const emit = defineEmits(['close-terms']);
const closeTerms = () => emit('close-terms');
</script>
<style scoped>
.terms_wrapper {
  position: relative;
  flex: 1;
  overflow-y: auto;
  margin-top: 76px;
  padding-bottom: 121px;
  &.nofooter {
    padding-bottom: 0px;
  }
}

.terms_inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.termtitle {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  color: #848a9c;
}

.termscript {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: #848a9c;
}

.termagree_wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 10px;
  background: linear-gradient(to top, #fff 80%, transparent 100%);
}

.terminfo {
  font-size: 14px;
  line-height: 1.6;
  color: $color-gray-800;
}

@media (max-width: 430px) {
  .terms_wrapper {
    margin-top: 52px;
  }
}

.terms_modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: #fff;
  overflow-y: auto;
  z-index: 200;
}
</style>
