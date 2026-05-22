"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      // зберігаємо в localStorage (твоя поточна система)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          role: "student",
        })
      );

      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-2xl w-[320px] text-center">

        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          Continue with Google
        </button>

      </div>
    </main>
  );
}