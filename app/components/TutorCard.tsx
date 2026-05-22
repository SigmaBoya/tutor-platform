"use client";

import Link from "next/link";

export default function TutorCard({ tutor }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
          {tutor.name?.[0] || "T"}
        </div>

        <div>
          <p className="font-semibold">{tutor.name}</p>
          <p className="text-xs text-gray-400">
            {tutor.subjects?.join(", ")}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3">
        {tutor.bio}
      </p>

      <div className="flex justify-between items-center">

        <div className="text-yellow-400 text-sm">
          ⭐ {tutor.rating || 0}
        </div>

        <p className="text-indigo-400 font-bold">
          ${tutor.price}/h
        </p>

        <Link
          href={`/book?tutor=${tutor.userId}`}
          className="bg-indigo-600 px-4 py-2 rounded-xl text-sm"
        >
          Book
        </Link>

      </div>

    </div>
  );
}