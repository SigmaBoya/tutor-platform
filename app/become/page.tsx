"use client";

import { useRouter } from "next/navigation";

export default function BecomeTutor() {
  const router = useRouter();

  const selectRole = (role: "student" | "tutor") => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "demo@user.com",
        role,
      })
    );

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-10">

      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold">
          Choose your role
        </h1>

        <p className="text-gray-400">
          Are you a student or a tutor?
        </p>

        <div className="flex gap-4 justify-center">

          <button
            onClick={() => selectRole("student")}
            className="bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20"
          >
            I am Student
          </button>

          <button
            onClick={() => selectRole("tutor")}
            className="bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-700"
          >
            I am Tutor
          </button>

        </div>

      </div>

    </main>
  );
}