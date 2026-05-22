"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateProfile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [price, setPrice] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  const handleCreate = async () => {
    if (!user) return alert("Login first");

    if (!name || !bio || !subjects || !price) {
      return alert("Fill all fields");
    }

    const data = {
      userId: user.id,
      name,
      bio,
      subjects: subjects.split(",").map((s: string) => s.trim()),
      price: Number(price),
      photoURL: photoURL || "",
      role: "tutor",
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "tutors", user.id), data);

    // оновлюємо localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, role: "tutor" })
    );

    alert("Profile created!");
    router.push("/dashboard");
  };

  if (!user) {
    return (
      <main className="text-white p-10">
        Login required
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        Create Tutor Profile
      </h1>

      <div className="max-w-md space-y-4">

        <input
          className="w-full p-3 rounded-xl bg-white/10"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded-xl bg-white/10"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-xl bg-white/10"
          placeholder="Subjects (math, english...)"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 rounded-xl bg-white/10"
          placeholder="Price per hour"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-xl bg-white/10"
          placeholder="Photo URL (optional)"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 py-3 rounded-xl"
        >
          Create Profile
        </button>

      </div>
    </main>
  );
}