// src/app/login/page.tsx
"use client";

import LoginForm from "@/components/login-form";
import { useAuth } from "@/contexts/AuthContext";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Setup client-side only code
  useEffect(() => {
    setMounted(true);

    // Redirect if already logged in
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Don't render anything until client-side code is running
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center p-4">
      <LoginForm />
    </div>
  );
}
