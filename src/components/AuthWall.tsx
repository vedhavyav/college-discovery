'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Send, ShieldAlert, Sparkles } from 'lucide-react';

export default function AuthWall() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/70 text-center">
        {/* Decorative ambient background spots */}
        <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl"></div>

        <div className="relative">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {isLogin 
              ? 'Sign in to join community discussions and ask questions.' 
              : 'Sign up to connect with alumni and discuss admissions.'
            }
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Name</label>
                <div className="relative mt-1.5 flex items-center rounded-xl bg-slate-50 border border-slate-250/50 focus-within:border-indigo-600 dark:bg-slate-900/50 dark:border-slate-800">
                  <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Saniya Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
              <div className="relative mt-1.5 flex items-center rounded-xl bg-slate-50 border border-slate-250/50 focus-within:border-indigo-600 dark:bg-slate-900/50 dark:border-slate-800">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. saniya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
              <div className="relative mt-1.5 flex items-center rounded-xl bg-slate-50 border border-slate-250/50 focus-within:border-indigo-600 dark:bg-slate-900/50 dark:border-slate-800">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}</span>
            </button>
          </form>

          {/* Toggle Link */}
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
