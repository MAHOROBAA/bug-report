// src/firebase/firebaseInit.js
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase 설정 (환경 변수 기반)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 최신 초기화 (로컬 캐시 + 멀티탭 동기화)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const storage = getStorage(app);

// Auth 초기화
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 필요 시 계정 선택 강제
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { db, storage, auth, googleProvider };
