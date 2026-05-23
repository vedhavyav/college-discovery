'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, BookOpen, FileText, Award, FolderOpen, MessageSquare, Heart, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const [shortlistCount, setShortlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/exams', label: 'Exams', icon: FileText },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
    { href: '/resources', label: 'Resources', icon: FolderOpen },
    { href: '/discussions', label: 'Community', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400 shrink-0">
          <GraduationCap className="h-6 w-6" />
          <span>EduDiscover</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-350'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth & Shortlist Action */}
        <div className="flex items-center gap-3">
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

          {/* Firebase Auth User Info */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="max-w-[100px] truncate">{user.displayName || 'User'}</span>
                </div>
                <button
                  onClick={() => logOut()}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/20 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/discussions"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 space-y-3">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50/10 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-355 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between px-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-500" />
                  {user.displayName || 'User'}
                </span>
                <button
                  onClick={() => {
                    logOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/discussions"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
