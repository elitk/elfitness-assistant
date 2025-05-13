'use client';

import SignUpForm from '@/components/signup-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (!mounted) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center p-4">
      <SignUpForm />
    </div>
  );
}