'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, GitCompare, Compass, MessageSquare, Heart } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [shortlistCount, setShortlistCount] = useState(0);

  // Read shortlist from localStorage and update counter
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('shortlisted_colleges');
        if (saved) {
          const list = JSON.parse(saved);
          setShortlistCount(list.length);
        } else {
          setShortlistCount(0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    updateCount();
    
    // Listen for storage events (updates from other pages)
    window.addEventListener('storage', updateCount);
    // Custom event listener for updates within same page context
    window.addEventListener('shortlistUpdated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('shortlistUpdated', updateCount);
    };
  }, []);

  const navLinks = [
    { href: '/colleges', label: 'Colleges', icon: GraduationCap },
    { href: '/compare', label: 'Compare', icon: GitCompare },
    { href: '/predictor', label: 'Predictor', icon: Compass },
    { href: '/discussions', label: 'Discussions', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
          <GraduationCap className="h-6 w-6" />
          <span>EduDiscover</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Shortlist Action */}
        <div className="flex items-center gap-4">
          <Link
            href="/shortlist"
            className="relative flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-indigo-400 transition-all duration-200"
            title="View Shortlisted Colleges"
          >
            <Heart className="h-5 w-5" />
            {shortlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:bg-indigo-500 dark:ring-slate-950">
                {shortlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
