"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const chatId = "global-chat";

  // load user safely
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  // realtime messages (safe)
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (err) => {
        console.log("Chat error:", err);
      }
    );

    return () => unsub();
  }, []);

  // send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (!user?.id) {
      alert("Login first");
      return;
    }

    try {
      await addDoc(
        collection(db, "chats", chatId, "messages"),
        {
          text,
          userId: user.id,
          email: user.email,
          createdAt: Date.now(),
        }
      );

      setText("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-6">
        Chat
      </h1>

      {/* messages */}
      <div className="space-y-3 mb-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[300px] p-3 rounded-2xl ${
              m.userId === user?.id
                ? "bg-indigo-600 ml-auto"
                : "bg-white/10"
            }`}
          >
            <p>{m.text}</p>

            <p className="text-xs text-gray-300 mt-1">
              {m.email}
            </p>
          </div>
        ))}
      </div>

      {/* input */}
      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 p-3 rounded-xl bg-white/10"
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 px-6 rounded-xl hover:bg-indigo-700"
        >
          Send
        </button>
      </div>

    </main>
  );
}