import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ ВАЖЛИВО: ці значення мають бути реальні з Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// 🔥 FIX: щоб Next.js не ініціалізував Firebase двічі
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// services
export const auth = getAuth(app);
export const db = getFirestore(app);