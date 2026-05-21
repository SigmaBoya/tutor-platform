"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthGuard } from "../lib/useAuthGuard";

export default function Dashboard() {
  useAuthGuard(); // ✅ ВАЖЛИВО — тут

  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(savedUser);

    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
    };

    fetchBookings();
  }, []);

  const myBookings =
    user?.role === "tutor"
      ? bookings.filter((b) => b.tutorId === user.id)
      : bookings.filter((b) => b.student === user.email);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        Dashboard ({user?.role})
      </h1>

      {myBookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet</p>
      ) : (
        <div className="space-y-4">

          {myBookings.map((b) => (
            <div key={b.id} className="bg-white/10 p-5 rounded-2xl">

              <p><b>Date:</b> {b.date}</p>
              <p><b>Message:</b> {b.message}</p>

              {user?.role === "student" ? (
                <p className="text-gray-400 mt-2">
                  Tutor ID: {b.tutorId}
                </p>
              ) : (
                <p className="text-gray-400 mt-2">
                  Student: {b.student}
                </p>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  );
}