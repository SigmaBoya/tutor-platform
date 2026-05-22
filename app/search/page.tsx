"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import TutorCard from "../components/TutorCard";

export default function SearchPage() {
  const [tutors, setTutors] = useState<any[]>([]);

  const [filter, setFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      const snap = await getDocs(collection(db, "tutors"));

      const data = snap.docs.map((doc) => doc.data());
      setTutors(data);
    };

    fetchTutors();
  }, []);

  const filtered = tutors.filter((t) => {
    const matchesText =
      t.name?.toLowerCase().includes(filter.toLowerCase()) ||
      t.subjects?.join(" ").toLowerCase().includes(filter.toLowerCase());

    const price = Number(t.price || 0);
    const rating = Number(t.rating || 0);

    const matchesPrice =
      (!minPrice || price >= Number(minPrice)) &&
      (!maxPrice || price <= Number(maxPrice));

    const matchesRating =
      !minRating || rating >= Number(minRating);

    return matchesText && matchesPrice && matchesRating;
  });

  return (
    <main className="min-h-screen text-white p-6">

      <h1 className="text-2xl font-bold mb-6">
        Find Tutors
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search by name or subject..."
        className="w-full p-3 rounded-xl bg-white/10 mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">

        <input
          type="number"
          placeholder="Min price"
          className="p-3 rounded-xl bg-white/10"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          className="p-3 rounded-xl bg-white/10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min rating (0-5)"
          className="p-3 rounded-xl bg-white/10"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />

      </div>

      {/* RESULTS */}
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <TutorCard key={i} tutor={t} />
        ))}
      </div>

    </main>
  );
}