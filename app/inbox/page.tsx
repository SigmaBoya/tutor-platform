"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export default function InboxPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // load user
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  // load notifications
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotifications(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [user?.id]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Login required
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-6">
        Inbox
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        <div className="space-y-4">

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border ${
                n.read ? "border-white/10" : "border-indigo-500"
              } bg-white/5`}
            >

              <p className="text-white">{n.text}</p>

              <p className="text-xs text-gray-400 mt-1">
                {n.type}
              </p>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}