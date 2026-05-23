'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, User, Calendar, MessageCircle, AlertCircle, PlusCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthWall from '@/components/AuthWall';

interface DiscussionQuestion {
  id: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  _count: {
    answers: number;
  };
}

export default function DiscussionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<DiscussionQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Question Form States
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/discussions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.displayName || user.email?.split('@')[0] || '');
    }
  }, [user]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a descriptive title for your question.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the question description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, title, content }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setTitle('');
        setContent('');
        setShowAskForm(false);
        // Refresh list
        fetchQuestions();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to post question.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <MessageSquare className="h-7 w-7 text-indigo-600" />
            <span>Discussion Board</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ask questions, share information, and talk to peers. Sign in to view and reply.
          </p>
        </div>
        <AuthWall />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-indigo-600" />
            <span>Discussion Board</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ask questions, share information, and talk to peers about college admissions, hostels, and placements.
          </p>
        </div>

        <button
          onClick={() => setShowAskForm(!showAskForm)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors shrink-0"
        >
          {showAskForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          <span>{showAskForm ? 'Close Editor' : 'Ask a Question'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Discussion listings */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950">
                  <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-900"></div>
                  <div className="mt-2 h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-900"></div>
                  <div className="mt-4 h-16 w-full rounded bg-slate-200 dark:bg-slate-900"></div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 py-16">
              <MessageSquare className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No discussions yet</h3>
              <p className="mt-2 text-sm text-slate-500">Be the first to start a conversation about college choices.</p>
              <button
                onClick={() => setShowAskForm(true)}
                className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Start Discussion
              </button>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className="group rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{question.userName}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(question.createdAt)}
                  </span>
                </div>

                <h3 className="mt-3 font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Link href={`/discussions/${question.id}`}>{question.title}</Link>
                </h3>
                
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-350 line-clamp-2 leading-relaxed">
                  {question.content}
                </p>

                <div className="mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded-lg dark:bg-indigo-950/20 dark:border-indigo-900/40">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{question._count.answers} {question._count.answers === 1 ? 'Answer' : 'Answers'}</span>
                  </span>
                  
                  <Link
                    href={`/discussions/${question.id}`}
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                  >
                    Reply to discussion &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Form to Ask Question */}
        <div>
          <div className={`rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950 sticky top-24 ${showAskForm ? 'ring-2 ring-indigo-600 border-transparent' : ''}`}>
            <h3 className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              <span>Ask a New Question</span>
            </h3>
            
            <form onSubmit={handleAskQuestion} className="mt-4 space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                  Discussion created successfully!
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Saniya Bose"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Topic / Title</label>
                <input
                  type="text"
                  placeholder="e.g. What is the average CSE placement package at VIT?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Question Content</label>
                <textarea
                  rows={5}
                  placeholder="Provide background context (e.g. details about hostel, fees, package comparisons, specific streams)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Posting...' : 'Post Question'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
