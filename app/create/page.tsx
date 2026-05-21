"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CreateTutor() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (!name || !subject || !price) {
      alert("Fill all fields");
      return;
    }

    const tutorData = {
      id: user.id,
      name,
      subject,
      price,
      email: user.email,
      role: "tutor",
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "tutors", user.id), tutorData);

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Create Tutor Profile</h1>

      <div className="max-w-md space-y-4">

        <input
          className="w-full p-3 bg-white/10 rounded-xl"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 rounded-xl"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 rounded-xl"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700"
        >
          Save
        </button>

      </div>
    </main>
  );
}