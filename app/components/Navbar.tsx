"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // load user (safe)
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  // realtime notifications (safe guard)
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setNotifications(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.log("Notification error:", error);
      }
    );

    return () => unsub();
  }, [user?.id]);

  const unreadCount = notifications?.filter((n) => !n?.read).length || 0;

  return (
    <div className="w-full p-4 bg-black text-white flex justify-between items-center">

      {/* LEFT */}
      <Link href="/" className="font-bold text-lg">
        TutorApp
      </Link>

      {/* RIGHT */}
      <div className="flex gap-5 items-center">

        <Link href="/search">Search</Link>

        {user?.role === "tutor" && (
          <Link href="/create">Create</Link>
        )}

        {/* 🔔 NOTIFICATIONS */}
        {user?.id && (
          <Link href="/dashboard" className="relative">
            🔔

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <Link href="/dashboard">Dashboard</Link>
        ) : (
          <Link href="/auth">Login</Link>
        )}

      </div>
    </div>
  );
}