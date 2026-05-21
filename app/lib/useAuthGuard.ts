"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard(requiredRole?: "student" | "tutor") {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/auth");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push("/");
    }
  }, [router, requiredRole]);
}