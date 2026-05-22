import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyTEST123",
  authDomain: "test.firebaseapp.com",
  projectId: "test",
  storageBucket: "test",
  messagingSenderId: "123",
  appId: "1:123:web:123",
};
// prevent double init in Next.js
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);