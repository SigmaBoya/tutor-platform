"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function TutorProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [tutor, setTutor] = useState<any>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;

      const ref = doc(db, "tutors", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTutor(snap.data());
      } else {
        setTutor(null);
      }
    };

    fetchTutor();
  }, [id]);

  if (!tutor) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Tutor not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-xl bg-white/10 p-6 rounded-2xl">

        <h1 className="text-3xl font-bold">
          {tutor.name}
        </h1>

        <p className="text-gray-400 mt-2">
          {tutor.subject}
        </p>

        <p className="text-indigo-300 font-bold mt-4">
          {tutor.price} / hour
        </p>

        <p className="mt-6 text-gray-300">
          {tutor.email}
        </p>

        <button
          onClick={() => router.push(`/book?tutor=${id}`)}
          className="mt-6 w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700"
        >
          Book Lesson
        </button>
        <Link href={`/chat/${id}`}>
  <button className="mt-3 w-full bg-green-600 py-2 rounded-xl">
    Chat with tutor
  </button>
</Link>

      </div>

    </main>
  );
}