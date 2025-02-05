'use client';

import { useAuthStore } from "@/store";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const authState = useAuthStore((state) => state);
  const checkAuth = useAuthStore((state) => state.initializeAuth);
  const lastPageVisited = useAuthStore((state) => state.lastPageVisited);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if(!authState.loading && !authState.user && !authState.token) {
      redirect("/login");
    }
    if (authState.user && authState.token) {
      if(lastPageVisited !== "") {
        router.push(lastPageVisited);
      }
      router.push("/dashboard/home");
    }
  }, [checkAuth, authState.user, authState.token, router, lastPageVisited, authState.loading]);

  return null;
}
