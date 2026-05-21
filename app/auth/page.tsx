"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "tutor" | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password) return;

    try {
      let userCredential;

      // REGISTER
      if (mode === "register") {
        if (!role) {
          alert("Select role");
          return;
        }

        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      // LOGIN
      else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = userCredential.user;

      // 🔥 FIRESTORE SAVE (ОЦЕ ТИ ДОДАЄШ)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: mode === "login" ? "student" : role,
      });

      // localStorage (поки залишаємо для UI)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.uid,
          email: user.email,
          role: mode === "login" ? "student" : role,
        })
      );

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-white/10 p-6 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl ${
              mode === "login" ? "bg-indigo-600" : "bg-white/10"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-xl ${
              mode === "register" ? "bg-indigo-600" : "bg-white/10"
            }`}
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <div className="mb-6">
            <p className="mb-2 text-gray-300">I am a:</p>

            <div className="flex gap-2">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 py-2 rounded-xl ${
                  role === "student" ? "bg-indigo-600" : "bg-white/10"
                }`}
              >
                Student
              </button>

              <button
                onClick={() => setRole("tutor")}
                className={`flex-1 py-2 rounded-xl ${
                  role === "tutor" ? "bg-indigo-600" : "bg-white/10"
                }`}
              >
                Tutor
              </button>
            </div>
          </div>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white/10 rounded-xl mb-3"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/10 rounded-xl mb-6"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700"
        >
          {mode === "login" ? "Login" : "Create account"}
        </button>

      </div>
    </main>
  );
}