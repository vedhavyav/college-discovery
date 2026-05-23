'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Send, User, Calendar, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthWall from '@/components/AuthWall';

interface DiscussionAnswer {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface DiscussionQuestion {
  id: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  answers: DiscussionAnswer[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiscussionDetailPage({ params }: PageProps) {
  const { user, loading: authLoading } = useAuth();
  const resolvedParams = use(params);
  const questionId = resolvedParams.id;

  const [question, setQuestion] = useState<DiscussionQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Reply Form States
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchQuestionDetails = async () => {
    try {
      const res = await fetch(`/api/discussions/${questionId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestion(data);
      } else {
        setError('Discussion topic not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load discussion details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || user.email?.split('@')[0] || '');
    }
  }, [user]);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter your response.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${questionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, content }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setContent('');
        // Refresh details
        await fetchQuestionDetails();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to post reply.');
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
      hour: '2-digit',
      minute: '2-digit',
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
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <MessageSquare className="h-7 w-7 text-indigo-600" />
            <span>Discussion Board</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to view discussion replies.
          </p>
        </div>
        <AuthWall />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/50 bg-white p-8 dark:border-slate-800/50 dark:bg-slate-950 animate-pulse">
            <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800 mb-4"></div>
            <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800 mb-6"></div>
            <div className="h-20 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Discussion Not Found</h2>
        <p className="mt-2 text-slate-500">The discussion topic you are looking for does not exist or has been deleted.</p>
        <Link
          href="/discussions"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discussions</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/discussions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discussions</span>
        </Link>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
            <User className="h-3.5 w-3.5 text-indigo-500" />
            <span>Asked by {question.userName}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-500 bg-slate-100/55 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(question.createdAt)}</span>
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl leading-tight">
          {question.title}
        </h1>

        <p className="mt-6 text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {question.content}
        </p>
      </div>

      {/* Replies/Answers Header */}
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <span>{question.answers.length} {question.answers.length === 1 ? 'Response' : 'Responses'}</span>
        </h2>
      </div>

      {/* Replies List */}
      <div className="space-y-4">
        {question.answers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800 py-12">
            <p className="text-sm text-slate-500">No responses yet. Be the first to share your opinion or advice!</p>
          </div>
        ) : (
          question.answers.map((answer) => (
            <div
              key={answer.id}
              className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-900 dark:bg-slate-950/40"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{answer.userName}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(answer.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {answer.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Reply Form */}
      <div className="mt-8 rounded-3xl border border-slate-200/50 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
        <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
          <Send className="h-4.5 w-4.5 text-indigo-600" />
          <span>Write a Response</span>
        </h3>
        
        <form onSubmit={handlePostAnswer} className="mt-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40">
              Your response has been posted successfully!
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Priyanjali Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Answer / Advice</label>
            <textarea
              rows={6}
              placeholder="Write your answer clearly, including references or personal experiences if possible..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? 'Posting...' : 'Post Response'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
