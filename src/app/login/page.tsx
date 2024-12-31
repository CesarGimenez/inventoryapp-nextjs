'use client';
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, token, loading } = useAuthStore((state) => state);
    const router = useRouter();

    useEffect(() => {
        if (user && token) {
            router.push("/dashboard/home");
        }
    }, [user, token, router]);
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}