// src/composables/useAuth.js
import { ref, computed, onMounted } from "vue";
import { auth, googleProvider } from "@/firebase/firebaseInit";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseInit";

const GUEST_EMAIL = "guest@portfolio.demo";
const GUEST_PASSWORD = "guest1234!";

export const currentUser = ref(null);
const loading = ref(true);      // UI용 로딩
const isAuthReady = ref(false); // 🔥 onAuthStateChanged 첫 응답 여부

let isAuthInited = false;
let unsubscribeAuth = null;

// users/{uid} 문서가 없으면 만들고, 있으면 lastLoginAt만 갱신
const ensureUserDoc = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      groupId: null, // 처음에는 그룹 ID 없음
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      userRef,
      {
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
};

const initAuthListener = () => {
  if (isAuthInited) return;

  isAuthInited = true;

  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    currentUser.value = user;

    // 새로고침 후에도 users/{uid} 문서가 보장되도록
    if (user) {
      try {
        await ensureUserDoc(user);
      } catch (error) {
        console.error("ensureUserDoc error in onAuthStateChanged:", error);
      }
    }

    loading.value = false;     // UI 로딩 끝
    isAuthReady.value = true;  // 🔥 auth 상태 1회 이상 수신 완료
  });
};

export function useAuth() {
  // 컴포저블이 불릴 때마다 리스너는 한 번만 세팅
  initAuthListener();

  const isLoggedIn = computed(() => !!currentUser.value);

  const isGuest = computed(() => currentUser.value?.email === GUEST_EMAIL);

  const loginAsGuest = async () => {
    try {
      loading.value = true;
      const result = await signInWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD);
      currentUser.value = result.user;

      const uid = result.user.uid;
      await setDoc(doc(db, "users", uid), { groupId: null }, { merge: true });

      try {
        await deleteDoc(doc(db, "groups", "portfolio", "members", uid));
      } catch (e) {
        // 멤버 문서가 없어도 무시
      }

      return result.user;
    } catch (error) {
      console.error("Guest login error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      loading.value = true;

      const result = await signInWithPopup(auth, googleProvider);
      currentUser.value = result.user;

      // 로그인 직후에도 users/{uid} 문서 생성/갱신
      await ensureUserDoc(result.user);

      return result.user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      loading.value = false;
      // 로그인 후에는 이미 auth 리스너가 돌고 있을 것이므로
      // isAuthReady는 그대로 true 유지
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      currentUser.value = null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  onMounted(() => {
    initAuthListener();
  });

  return {
    currentUser,
    isLoggedIn,
    isGuest,
    loading,
    isAuthReady,
    loginWithGoogle,
    loginAsGuest,
    logout,
  };
}
