'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
// import { Dumbbell } from 'lucide-react';
import NavLink from './NavLink';
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client';


export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()
  
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/progress', label: 'Progress' },
    { href: '/profile', label: 'Profile' },
  ];
  
  const handleLogout = useCallback(async () => {
  
    await supabase.auth.signOut();
    await fetch('/auth/signout', { method: 'POST', credentials: 'include' });

    // 2 – clean up anything you stored locally
    localStorage.removeItem('fitnessCoachUserId')
    sessionStorage.clear()

    // 3 – re-render RSCs with the fresh (logged-out) state
    router.replace('/login');

  }, [router])

  return (
    <nav className="bg-[#121417] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link href="/dashboard" className="flex items-center space-x-2">
          {/* TODO: Add icon */}
          <span className="font-bold text-xl">Icon</span>
          <span className="font-bold text-xl">FitCoach AI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <button className="bg-[#0D69F2] hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors">
            Upgrade
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md font-medium transition-colors border border-white/20 hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 px-6 space-y-3">
          {navItems.map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              mobile={true}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button className="w-full bg-[#0D69F2] hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors mt-3">
            Upgrade
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md font-medium transition-colors border border-white/20 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}