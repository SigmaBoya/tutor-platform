"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    // user
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // tutors from Firestore
    const fetchTutors = async () => {
      const querySnapshot = await getDocs(collection(db, "tutors"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTutors(data);
    };

    fetchTutors();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-950 text-white">

      {/* NAV */}
      <div className="flex items-center justify-between px-10 py-6">
        <h1 className="text-xl font-bold">TutorMarket</h1>

        <div className="flex gap-6 text-sm text-gray-300 items-center">

          <Link href="/search">
            <p className="cursor-pointer hover:text-white">Find Tutors</p>
          </Link>

          {user?.role === "tutor" ? (
            <Link href="/create">
              <p className="cursor-pointer hover:text-white">Create Profile</p>
            </Link>
          ) : (
            <Link href="/become">
              <p className="cursor-pointer hover:text-white">Become Tutor</p>
            </Link>
          )}

          {!user ? (
            <Link href="/auth">
              <div className="bg-indigo-600 px-4 py-2 rounded-xl">
                Login / Register
              </div>
            </Link>
          ) : (
            <div className="text-sm text-gray-300">
              {user.email}
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <section className="text-center mt-20 px-6">
        <h2 className="text-5xl font-bold">
          Find the perfect tutor <br /> in minutes
        </h2>

        <p className="text-gray-400 mt-4">
          Learn faster with verified tutors.
        </p>
      </section>

      {/* CARDS */}
      <section className="mt-24 px-10 grid md:grid-cols-3 gap-6">

        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white/10 p-6 rounded-2xl hover:scale-105 transition"
          >
            <h3 className="text-lg font-bold">{tutor.name}</h3>
            <p className="text-gray-300">{tutor.subject}</p>
            <p className="mt-2 text-indigo-300 font-semibold">
              {tutor.price}
            </p>

            <Link href={`/tutor/${tutor.id}`}>
              <button className="mt-4 w-full bg-white/10 py-2 rounded-xl">
                View profile
              </button>
            </Link>
          </div>
        ))}

      </section>
    </main>
  );
}