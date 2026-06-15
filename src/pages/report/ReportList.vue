<template>
  <section class="report_list">
    <h2>리포트 내역</h2>
    <!-- 검색 필터 영역 -->
    <div class="filter_wrapper">
      <div class="filter_row">
        <!-- 커스텀 셀렉트 -->
        <div class="form_field category_box">
          <label class="label_text">카테고리</label>
          <CustomSelect v-model="selectedCategory" :showAll="true" />
        </div>
        <!-- 발생일 -->
        <div class="form_field">
          <label class="label_text" for="searchDate">발생일</label>
          <input
            id="searchDate"
            type="text"
            v-model="searchDate"
            placeholder="YYYYMMDD"
            maxlength="8"
            @input="filterDateFormat"
          />
        </div>
      </div>
      <div class="filter_row">
        <!-- 검색어 -->
        <div class="form_field">
          <label class="label_text" for="searchKeyword">검색어</label>
          <input
            id="searchKeyword"
            type="text"
            v-model="searchKeyword"
            placeholder="검색어를 입력하세요"
          />
        </div>
        <!-- 검색 버튼 -->
        <button
          class="search_btn"
          :disabled="!isSearchEnabled"
          @click="handleSearch"
        >
          검색
        </button>
      </div>
    </div>
    <div class="line"></div>
    <!-- 빈 상태 -->
    <p v-if="isLoading" class="empty_text">
      최근 리포트를 불러오는 중이에요{{ loadingDots }}
    </p>
    <p v-else-if="!filteredReports.length" class="empty_text">
      기록된 리포트가 없습니다.
    </p>

    <!-- 리포트 목록 -->
    <div class="report_items" v-else>
      <div
        v-for="(report, index) in filteredReports"
        :key="report.id"
        class="report_item"
      >
        <!-- 요약 영역 -->
        <div class="item_inner">
          <div class="item_left">
            <div
              class="item_icon"
              :class="{ rotating: report.isRotating }"
              @click="toggleExpand(report.id)"
            >
              <transition name="fade" mode="out-in">
                <img
                  :key="report.isOpen || !contentOverflows[report.id]"
                  :src="
                    report.isOpen || !contentOverflows[report.id]
                      ? closeIcon
                      : openIcon
                  "
                  alt="toggle icon"
                  class="icon_img"
                />
              </transition>
            </div>
          </div>
          <div class="item_right">
            <div class="item_info">
              <div class="item_row">
                <div class="item_field">
                  <label>카테고리</label>
                  <p v-if="!report.isEditing" class="item_category">
                    {{ report.category }}
                  </p>
                  <CustomSelect
                    v-else
                    v-model="report.category"
                    class="edit_select"
                  />
                </div>
                <div class="item_field">
                  <label>발생시각</label>
                  <p v-if="!report.isEditing" class="item_date">
                    {{ report.occurredAt }}
                  </p>
                  <input
                    v-else
                    type="text"
                    v-model="report.occurredAt"
                    placeholder="YYYY-MM-DD HH:MM"
                    maxlength="16"
                  />
                </div>
              </div>
              <p class="item_registered web">
                등록일자 {{ formatDate(report.createdAt) }}
              </p>
            </div>
            <!-- 리포트 내용 (항상 노출, 3줄 초과 시 말줄임) -->
            <div class="item_detail">
              <div class="item_field">
                <label>리포트</label>
                <div class="item_contents">
                  <p
                    v-if="!report.isEditing"
                    class="item_content"
                    :class="{ content_collapsed: !report.isOpen }"
                    :ref="(el) => setContentRef(el, report.id)"
                  >
                    {{ report.content }}
                  </p>
                  <textarea
                    v-else
                    v-model="report.content"
                    class="edit_textarea"
                    rows="3"
                  />
                </div>
              </div>
              <div
                v-if="report.isOpen || report.isEditing"
                class="item_buttons"
              >
                <button
                  class="btn_edit"
                  @click="
                    report.isEditing ? saveReport(index) : editReport(index)
                  "
                >
                  {{ report.isEditing ? '저장' : '수정' }}
                </button>
                <button class="btn_delete" @click="deleteReport(index)">
                  삭제
                </button>
              </div>
            </div>
            <p class="item_registered mob">등록일자 {{ report.createdAt }}</p>
            <div class="reaction_wrapper">
              <button
                v-for="(emoji, index) in reactionList"
                :key="index"
                class="reaction_btn"
                :class="{ active: userReactions[report.id]?.includes(emoji) }"
                @click="toggleReaction(report.id, emoji)"
              >
                <p>{{ emoji }}</p>
                <p class="count">{{ report.reactions?.[emoji] || 0 }}</p>
              </button>
            </div>
          </div>
        </div>
        <!-- 댓글 섹션 -->
        <div class="comment_section">
          <div class="comment_header" @click="toggleComments(report.id)">
            <img
              :src="
                isCommentOpen[report.id] ? commentCloseIcon : commentOpenIcon
              "
              alt="댓글 토글"
              class="comment_toggle_icon"
              :class="{ rotating: isCommentOpen[report.id] }"
            />
            <p v-if="(report.commentCount || 0) > 0" class="comment_count">
              {{ report.commentCount }}
            </p>
          </div>
          <div class="comment_inner">
            <!-- 댓글 목록: 접힘/펼침 + 페이드 -->
            <transition name="fade">
              <div v-if="isCommentOpen[report.id]" class="comment_area">
                <!-- 댓글 목록 -->
                <div class="comment_list">
                  <div
                    v-for="(comment, cIndex) in comments[report.id]"
                    :key="comment.id"
                    class="comment_item"
                  >
                    <!-- 수정 중일 때 -->
                    <template v-if="editingComments[comment.id] !== undefined">
                      <div class="comment_item_edit">
                        <input
                          v-model="editingComments[comment.id]"
                          class="comment_edit_input"
                        />
                        <div class="comment_icons">
                          <img
                            src="@/assets/images/save_icon.png"
                            alt="저장"
                            class="comment_icon_btn"
                            @click="saveComment(report.id, comment.id)"
                          />
                        </div>
                      </div>
                    </template>

                    <!-- 일반 표시 -->
                    <template v-else>
                      <div
                        class="comment_box"
                        :class="`comment_box--type-${(cIndex % 3) + 1}`"
                      >
                        <p class="comment_content">{{ comment.content }}</p>
                        <div
                          v-if="comment.authorId === currentUser?.uid"
                          class="comment_icons"
                        >
                          <img
                            src="@/assets/images/edit_icon.png"
                            alt="수정"
                            class="comment_icon_btn"
                            @click="startEditComment(comment)"
                          />
                          <img
                            src="@/assets/images/delete_icon.png"
                            alt="삭제"
                            class="comment_icon_btn"
                            @click="deleteComment(report.id, comment.id)"
                          />
                        </div>
                      </div>
                      <p class="comment_date item_registered">
                        {{ formatDate(comment.createdAt) }}
                      </p>
                    </template>
                  </div>
                </div>
              </div>
            </transition>
            <!-- 댓글 입력: 항상 노출 -->
            <div class="comment_input_row">
              <p class="comment_title">댓글</p>
              <input
                v-model="newComments[report.id]"
                placeholder="댓글을 입력하세요"
                class="comment_input"
                @keyup.enter="addComment(report.id)"
              />
              <button class="submit_btn" @click="addComment(report.id)">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Top 버튼 -->
    <button class="btn_top" @click="scrollToTop" v-show="showTopBtn">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1904_442)">
          <path
            d="M20 5C32 5 35 8 35 20C35 32 32 35 20 35C8 35 5 32 5 20C5 8 8 5 20 5Z"
            fill="#6000B4"
            fill-opacity="0.1"
            stroke="#6000B4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 21.6666L20 16.6666L25 21.6666"
            stroke="#6000B4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1904_442">
            <rect width="40" height="40" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
    <!-- 모달 -->
    <Modal
      v-if="!!modal && modal.isOpen.value"
      :type="modal.modalType.value"
      :title="modal.modalTitle.value"
      :message="modal.modalMessage.value"
      @confirm="modal.confirm"
      @cancel="modal.cancel"
      @close="modal.closeModal"
    />
  </section>
</template>
<script setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    watch,
    nextTick,
  } from 'vue';
  import CustomSelect from '../../components/CustomSelect.vue';
  import Modal from '../../components/Modal.vue';
  import { useModal } from '../../composables/useModal.js';
  import { useReports } from '../../composables/useReports.js';
  import { currentUser } from '@/composables/useAuth.js';
  import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    doc,
    increment,
  } from 'firebase/firestore';
  import { db } from '@/firebase/firebaseInit';

  // --------------------------------------------------
  // 기본 세팅
  // --------------------------------------------------
  const openIcon = new URL('@/assets/images/open_icon.png', import.meta.url)
    .href;
  const closeIcon = new URL('@/assets/images/close_icon.png', import.meta.url)
    .href;
  const commentOpenIcon = new URL(
    '@/assets/images/comment_open_icon.png',
    import.meta.url,
  ).href;
  const commentCloseIcon = new URL(
    '@/assets/images/comment_close_icon.png',
    import.meta.url,
  ).href;
  const modal = useModal();
  const { reports, isFetched, removeReport, updateReport } = useReports();

  // content 요소 참조 및 3줄 overflow 감지
  const contentEl = ref({});
  const contentOverflows = ref({});

  const setContentRef = (el, id) => {
    if (el) {
      contentEl.value[id] = el;
      nextTick(() => checkOverflow(id));
    }
  };

  const checkOverflow = (id) => {
    const el = contentEl.value[id];
    if (!el) return;
    contentOverflows.value[id] = el.scrollHeight > el.clientHeight;
  };

  // --------------------------------------------------
  // 리액션 관련
  // --------------------------------------------------
  const reactionList = ['😤', '😩', '😐', '🙂', '😅'];
  const userReactions = ref({}); // { reportId: ['🙂'] }

  const toggleReaction = async (reportId, emoji) => {
    const report = reports.value.find((r) => r.id === reportId);
    if (!report) return;

    if (!report.reactions) {
      report.reactions = {};
      reactionList.forEach((e) => (report.reactions[e] = 0));
    }

    const currentUserReactions = userReactions.value[reportId] || [];
    const hasReacted = currentUserReactions.includes(emoji);
    const newCount = hasReacted
      ? Math.max(0, (report.reactions[emoji] || 0) - 1)
      : (report.reactions[emoji] || 0) + 1;

    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      [`reactions.${emoji}`]: newCount,
    });

    report.reactions[emoji] = newCount;

    if (hasReacted) {
      userReactions.value[reportId] = currentUserReactions.filter(
        (e) => e !== emoji,
      );
      localStorage.removeItem(`${reportId}_${emoji}`);
    } else {
      userReactions.value[reportId] = [...currentUserReactions, emoji];
      localStorage.setItem(`${reportId}_${emoji}`, 'true');
    }
  };

  onMounted(() => {
    reports.value.forEach((r) => {
      userReactions.value[r.id] = reactionList.filter(
        (e) => localStorage.getItem(`${r.id}_${e}`) === 'true',
      );
    });
  });

  // --------------------------------------------------
  // 로딩 상태
  // --------------------------------------------------
  const isLoading = ref(false);
  const loadingDots = ref('.');
  let loadingTimer = null;
  let delayTimer = null;

  watch(isFetched, (loaded) => {
    if (!loaded) {
      delayTimer = setTimeout(() => {
        isLoading.value = true;
        loadingTimer = setInterval(() => {
          loadingDots.value =
            loadingDots.value.length < 3 ? loadingDots.value + '.' : '.';
        }, 500);
      }, 600);
    } else {
      clearTimeout(delayTimer);
      isLoading.value = false;
      clearInterval(loadingTimer);
    }
  });

  onBeforeUnmount(() => {
    clearTimeout(delayTimer);
    clearInterval(loadingTimer);
  });

  // --------------------------------------------------
  // 검색 필터
  // --------------------------------------------------
  const selectedCategory = ref('');
  const searchDate = ref('');
  const searchKeyword = ref('');

  const isSearchEnabled = computed(
    () =>
      selectedCategory.value ||
      searchDate.value.trim() ||
      searchKeyword.value.trim(),
  );

  const filterDateFormat = () => {
    searchDate.value = searchDate.value.replace(/[^\d]/g, '').substring(0, 8);
  };

  const filteredReports = computed(() => {
    const list = reports.value.filter((r) => {
      const matchCategory =
        !selectedCategory.value || r.category === selectedCategory.value;
      const matchDate =
        !searchDate.value ||
        (r.occurredAt &&
          r.occurredAt.replace(/[-:\s]/g, '').includes(searchDate.value));
      const matchKeyword =
        !searchKeyword.value ||
        (r.content &&
          r.content.toLowerCase().includes(searchKeyword.value.toLowerCase()));
      return matchCategory && matchDate && matchKeyword;
    });

    // 작성 시각(createdAt) 기준 내림차순 정렬
    return list.sort((a, b) => {
      const getTime = (val) => {
        if (!val) return 0;

        // Timestamp 타입일 때
        if (typeof val.toDate === 'function') {
          return val.toDate().getTime();
        }

        // 문자열일 때 (예: '2025-10-24 17:31')
        const t = new Date(val).getTime();
        return Number.isNaN(t) ? 0 : t;
      };

      return getTime(b.createdAt) - getTime(a.createdAt);
    });
  });

  const handleSearch = () => {
    console.log('검색 실행:', {
      category: selectedCategory.value,
      date: searchDate.value,
      keyword: searchKeyword.value,
    });
  };

  // --------------------------------------------------
  // 리포트 조작
  // --------------------------------------------------
  const toggleExpand = (id) => {
    if (!contentOverflows.value[id]) return; // 3줄 이하: 동작 없음
    const target = reports.value.find((r) => r.id === id);
    if (!target) return;
    target.isRotating = true;
    setTimeout(() => (target.isOpen = !target.isOpen), 300);
    setTimeout(() => (target.isRotating = false), 600);
  };

  const editReport = (index) => (reports.value[index].isEditing = true);

  const saveReport = async (index) => {
    const report = reports.value[index];
    report.isEditing = false;
    try {
      await updateReport(report.id, {
        category: report.category,
        occurredAt: report.occurredAt,
        content: report.content,
        // createdAt 은 수정하지 않는다
      });
      modal.openModal('alert', '수정 완료', '수정이 완료되었습니다.');
    } catch (e) {
      console.error('수정 오류:', e);
      modal.openModal('alert', '수정 실패', '업데이트 중 오류가 발생했습니다.');
    }
  };

  const deleteReport = (index) => {
    const report = reports.value[index];
    modal.openModal('confirm', '리포트 삭제', '삭제하시겠어요?', {
      onConfirm: async () => {
        try {
          await removeReport(report.id);
          await new Promise((r) => setTimeout(r, 300));
          modal.openModal('alert', '삭제 완료', '리포트가 삭제되었습니다.');
        } catch (e) {
          console.error('삭제 중 오류:', e);
          modal.openModal('alert', '삭제 실패', '삭제 중 오류가 발생했습니다.');
        }
      },
    });
  };

  // --------------------------------------------------
  // 날짜 포맷
  // --------------------------------------------------
  const formatDate = (date) => {
    if (!date) return '-';

    try {
      // Firestore Timestamp 타입일 때
      if (typeof date.toDate === 'function') {
        const d = date.toDate();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${day} ${h}:${min}`;
      }

      // 이미 문자열(예: '2025-10-24 17:31')로 들어온 경우는 그대로 사용
      if (typeof date === 'string') {
        // 혹시 초까지 있는 경우 잘라주고 싶으면 아래 주석 풀어도 됨
        return date.slice(0, 16);
        return date;
      }

      // 그 외 타입 방어
      const d = new Date(date);
      if (!Number.isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${day} ${h}:${min}`;
      }

      return '-';
    } catch (e) {
      console.error('날짜 변환 오류:', e);
      return '-';
    }
  };

  // --------------------------------------------------
  // 댓글 기능 (서브컬렉션)
  // --------------------------------------------------
  const comments = ref({});
  const newComments = ref({});
  const editingComments = ref({});
  const isCommentOpen = ref({});

  const toggleComments = (reportId) => {
    isCommentOpen.value[reportId] = !isCommentOpen.value[reportId];
    if (isCommentOpen.value[reportId] && !comments.value[reportId]) {
      subscribeComments(reportId);
    }
  };

  const subscribeComments = (reportId) => {
    const commentsRef = collection(db, 'reports', reportId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    onSnapshot(q, (snapshot) => {
      comments.value[reportId] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  };

  const addComment = async (reportId) => {
    const text = newComments.value[reportId];
    if (!text?.trim()) return;

    const commentsRef = collection(db, 'reports', reportId, 'comments');
    await addDoc(commentsRef, {
      content: text.trim(),
      authorId: currentUser.value?.uid,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'reports', reportId), {
      commentCount: increment(1),
    });
    newComments.value[reportId] = '';

    if (!comments.value[reportId]) subscribeComments(reportId);
    isCommentOpen.value[reportId] = true;
  };

  const startEditComment = (comment) => {
    editingComments.value[comment.id] = comment.content;
  };

  const saveComment = async (reportId, commentId) => {
    const newText = editingComments.value[commentId];
    if (!newText?.trim()) return;
    const commentRef = doc(db, 'reports', reportId, 'comments', commentId);
    await updateDoc(commentRef, { content: newText.trim() });
    delete editingComments.value[commentId];
  };

  const deleteComment = async (reportId, commentId) => {
    modal.openModal('confirm', '댓글 삭제', '댓글을 삭제하시겠습니까?', {
      onConfirm: async () => {
        try {
          const commentRef = doc(
            db,
            'reports',
            reportId,
            'comments',
            commentId,
          );
          await deleteDoc(commentRef);

          const reportRef = doc(db, 'reports', reportId);
          const snap = await getDoc(reportRef);
          const current = snap.data()?.commentCount ?? 0;
          await updateDoc(reportRef, {
            commentCount: Math.max(0, current - 1),
          });

          modal.openModal('alert', '삭제 완료', '댓글이 삭제되었습니다.');
        } catch (e) {
          console.error('댓글 삭제 오류:', e);
          modal.openModal(
            'alert',
            '삭제 실패',
            '댓글 삭제 중 오류가 발생했습니다.',
          );
        }
      },
    });
  };

  // --------------------------------------------------
  // Top 버튼
  // --------------------------------------------------
  const showTopBtn = ref(false);
  const handleScroll = () => (showTopBtn.value = window.scrollY > 300);
  onMounted(() => window.addEventListener('scroll', handleScroll));
  onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll));
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>
<style scoped>
  .content_collapsed {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .comment_count {
    font-size: 13px;
    font-weight: 500;
    color: #848a9c;
    text-align: center;
    line-height: 1;
    margin-top: 10px;
  }
</style>
