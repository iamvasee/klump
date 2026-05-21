'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FullLogo } from '@/components/ui/Logo';
import { GhostButton } from '@/components/ui/Button/index';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-xl shadow-gray-200/20 border-b border-gray-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10">
        <FullLogo
          className={`transition-all duration-500 ${scrolled ? 'h-5 sm:h-6' : 'h-7 sm:h-8'}`}
        />
        <div className="flex items-center">
          <Link href="/auth">
            <GhostButton
              size="sm"
              className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600"
            >
              Sign In
            </GhostButton>
          </Link>
        </div>
      </div>
    </nav>
  );
}
