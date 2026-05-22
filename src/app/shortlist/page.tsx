'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MapPin, DollarSign, Star, Award, Trash2, GitCompare, Landmark, ArrowRight } from 'lucide-react';

interface College {
  id: string;
  name: string;
  logoUrl: string | null;
  coverUrl: string | null;
  city: string;
  state: string;
  established: number;
  type: string;
  rating: number;
  fees: number;
  placementMedian: number;
  placementHighest: number;
  ranking: number | null;
  overview: string;
}

export default function ShortlistPage() {
  const [shortlisted, setShortlisted] = useState<College[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on client-side mount
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem('shortlisted_colleges');
      if (savedShortlist) {
        setShortlisted(JSON.parse(savedShortlist));
      }

      const savedCompare = localStorage.getItem('compare_colleges');
      if (savedCompare) {
        setCompareIds(JSON.parse(savedCompare));
      }
    } catch (err) {
      console.error('Failed to load data from localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveShortlist = (collegeId: string) => {
    try {
      const updatedList = shortlisted.filter((c) => c.id !== collegeId);
      setShortlisted(updatedList);
      localStorage.setItem('shortlisted_colleges', JSON.stringify(updatedList));
      // Dispatch custom event to notify Navbar and other open pages
      window.dispatchEvent(new Event('shortlistUpdated'));
    } catch (err) {
      console.error('Failed to update shortlist', err);
    }
  };

  const toggleCompare = (collegeId: string) => {
    let list: string[] = [];
    try {
      const saved = localStorage.getItem('compare_colleges');
      if (saved) list = JSON.parse(saved);
    } catch (err) {}

    const exists = list.includes(collegeId);
    let updatedList: string[];
    if (exists) {
      updatedList = list.filter((id) => id !== collegeId);
      setCompareIds(updatedList);
    } else {
      if (list.length >= 3) {
        alert('You can compare up to 3 colleges at once.');
        return;
      }
      updatedList = [...list, collegeId];
      setCompareIds(updatedList);
    }

    localStorage.setItem('compare_colleges', JSON.stringify(updatedList));
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          <div className="mt-2 h-4 w-96 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950">
              <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[75vh]">
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-6 dark:border-slate-900">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
          <span>My Shortlisted Colleges</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          You have saved {shortlisted.length} {shortlisted.length === 1 ? 'college' : 'colleges'} for review. Compare them side-by-side or view detail pages.
        </p>
      </div>

      {shortlisted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-850 py-20 max-w-2xl mx-auto bg-slate-50/30 dark:bg-slate-950/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">Your shortlist is empty</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Save colleges you're interested in by tapping the heart icon on listings. They will appear here for quick access.
          </p>
          <Link
            href="/colleges"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <span>Explore Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shortlisted.map((college) => {
            const isComparing = compareIds.includes(college.id);

            return (
              <div
                key={college.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
              >
                {/* Cover & Rating overlay */}
                <div className="relative h-40 bg-slate-100 dark:bg-slate-900">
                  {college.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={college.coverUrl}
                      alt={college.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10" />
                  )}

                  {/* Rating overlay */}
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm dark:bg-slate-900/95 dark:text-white">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{college.rating.toFixed(1)}</span>
                  </div>

                  {/* NIRF Rank */}
                  {college.ranking && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-indigo-500">
                      <Award className="h-3.5 w-3.5" />
                      <span>NIRF #{college.ranking}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {college.type} Institute
                  </span>
                  <h3 className="mt-1 font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Link href={`/colleges/${college.id}`}>{college.name}</Link>
                  </h3>

                  {/* Location */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{college.city}, {college.state}</span>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Avg Fees</span>
                      <div className="mt-0.5 flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                        <Landmark className="mr-1 h-3.5 w-3.5 text-indigo-500" />
                        <span>{formatCurrency(college.fees)}/yr</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Median Salary</span>
                      <div className="mt-0.5 flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                        <DollarSign className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                        <span>{college.placementMedian.toFixed(1)} LPA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                  <Link
                    href={`/colleges/${college.id}`}
                    className="flex-1 text-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-semibold py-2.5 text-slate-700 dark:text-slate-200 transition-all duration-200"
                  >
                    View Details
                  </Link>
                  <div className="ml-3 flex gap-2">
                    {/* Compare */}
                    <button
                      onClick={() => toggleCompare(college.id)}
                      className={`rounded-xl p-2.5 transition-all duration-200 border ${
                        isComparing
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
                    >
                      <GitCompare className="h-4 w-4" />
                    </button>

                    {/* Delete Shortlist */}
                    <button
                      onClick={() => handleRemoveShortlist(college.id)}
                      className="rounded-xl border border-rose-200 bg-white p-2.5 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-950 dark:hover:bg-rose-950/20 transition-all duration-200"
                      title="Remove from Shortlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
