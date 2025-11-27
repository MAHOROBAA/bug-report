// src/composables/useAuth.js
import { ref, computed, onMounted } from "vue";
import { auth, googleProvider } from "@/firebase/firebaseInit";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseInit";

const currentUser = ref(null);
const loading = ref(true);

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

    loading.value = false;
  });
};

export function useAuth() {
  // 컴포저블이 불릴 때마다 리스너는 한 번만 세팅
  initAuthListener();

  const isLoggedIn = computed(() => !!currentUser.value);

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
    loading,
    loginWithGoogle,
    logout,
  };
}
