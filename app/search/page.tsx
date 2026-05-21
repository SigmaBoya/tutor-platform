"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function SearchPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      const snapshot = await getDocs(collection(db, "tutors"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTutors(data);
    };

    fetchTutors();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredTutors = tutors.filter((t) => {
    const q = query.toLowerCase();

    return (
      t.name?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-6">
        Find a Tutor
      </h1>

      {/* SEARCH INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or subject..."
        className="w-full max-w-md p-3 mb-8 bg-white/10 rounded-xl"
      />

      {/* RESULTS */}
      <div className="grid gap-4">

        {filteredTutors.length === 0 ? (
          <p className="text-gray-400">No tutors found</p>
        ) : (
          filteredTutors.map((t) => (
            <div
              key={t.id}
              className="bg-white/10 p-5 rounded-2xl"
            >
              <h2 className="text-xl font-bold">{t.name}</h2>
              <p className="text-gray-400">{t.subject}</p>
              <p className="text-indigo-300 font-bold mt-2">
                {t.price} / hour
              </p>

              <Link href={`/book?tutor=${t.id}`}>
                <button className="mt-4 w-full bg-indigo-600 py-2 rounded-xl hover:bg-indigo-700">
                  Book
                </button>
              </Link>
            </div>
          ))
        )}

      </div>
    </main>
  );
}