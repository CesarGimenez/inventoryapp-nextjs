'use client';

import { useAuthStore } from "@/store";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const authState = useAuthStore((state) => state);
  const checkAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (authState.user && authState.token) {
      router.push("/dashboard/home");
    } else {
      router.push("/login");
    }
  }, [checkAuth, authState.user, authState.token, router]);

  return null;
}
