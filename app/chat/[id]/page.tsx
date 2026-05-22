"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
} from "firebase/firestore";

function getChatId(userA: string, userB: string) {
  return [userA, userB].sort().join("_");
}

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // load user
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  // get other user from URL
  useEffect(() => {
    if (!user?.id) return;

    const params = new URLSearchParams(window.location.search);
    const other = params.get("user");

    if (other) {
      setOtherUserId(other);
      setChatId(getChatId(user.id, other));
    }
  }, [user]);

  // realtime messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim() || !user || !chatId) return;

    // 1. message
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
    });

    // 2. chat meta (для inbox)
    await setDoc(
      doc(db, "chats", chatId),
      {
        users: [user.id, otherUserId],
        lastMessage: text,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    setText("");
  };

  if (!user) return <p className="text-white p-10">Loading...</p>;
  if (!chatId) return <p className="text-white p-10">No chat selected</p>;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="space-y-3 mb-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl max-w-[300px] ${
              m.userId === user.id
                ? "bg-indigo-600 ml-auto"
                : "bg-white/10"
            }`}
          >
            <p>{m.text}</p>
            <p className="text-xs text-gray-300">{m.email}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 p-3 rounded-xl bg-white/10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </main>
  );
}