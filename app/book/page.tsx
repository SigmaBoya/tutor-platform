"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor");

  const [tutor, setTutor] = useState<any>(null);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 load tutor from Firestore
  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutorId) return;

      const ref = doc(db, "tutors", tutorId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTutor(snap.data());
      } else {
        setTutor(null);
      }
    };

    fetchTutor();
  }, [tutorId]);

  const handleBook = async () => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (!tutorId) {
      alert("Missing tutor ID");
      return;
    }

    if (!date || !message) {
      alert("Fill all fields");
      return;
    }

    try {
      // 1. booking
      await addDoc(collection(db, "bookings"), {
        tutorId,
        student: user.email,
        studentId: user.id,
        date,
        message,
        createdAt: new Date().toISOString(),
      });

      // 2. notification (safe dynamic import)
      try {
        const { createNotification } = await import("../lib/notifications");

        await createNotification({
          userId: tutorId,
          type: "booking",
          text: `New booking from ${user.email}`,
        });
      } catch (err) {
        console.log("Notification failed:", err);
      }

      alert("Booked successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!tutorId) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Missing tutor ID</p>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Tutor not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        Book lesson with {tutor.name}
      </h1>

      <div className="max-w-md space-y-4">
        <input
          type="date"
          className="w-full p-3 bg-white/10 rounded-xl"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          className="w-full p-3 bg-white/10 rounded-xl"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleBook}
          className="w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700"
        >
          Confirm Booking
        </button>
      </div>
    </main>
  );
}