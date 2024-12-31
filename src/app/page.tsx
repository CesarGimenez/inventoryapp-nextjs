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
  }, [checkAuth]);
  
  redirect("/dashboard/home");
}
