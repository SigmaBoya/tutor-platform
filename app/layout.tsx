"use client";

import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] text-white">

        {/* TOP NAVBAR */}
        <header className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 z-50">
          <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">

            <Link href="/" className="font-bold text-xl text-indigo-400">
              TutorApp
            </Link>

            <div className="flex gap-6 text-sm">
              <Link href="/search" className="hover:text-indigo-400">Search</Link>
              <Link href="/inbox" className="hover:text-indigo-400">Inbox</Link>
              <Link href="/dashboard" className="hover:text-indigo-400">Dashboard</Link>
              <Link href="/auth" className="hover:text-indigo-400">Login</Link>
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-20 pb-24 max-w-6xl mx-auto px-4">
          {children}
        </main>

        {/* BOTTOM SEARCH BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 p-3">
          <div className="max-w-2xl mx-auto flex gap-2">

            <input
              placeholder="Search tutors..."
              className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
            />

            <button className="bg-indigo-600 px-5 rounded-xl">
              Search
            </button>

          </div>
        </div>

      </body>
    </html>
  );
}