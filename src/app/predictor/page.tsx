'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, GraduationCap, DollarSign, Star, Award, MapPin, Landmark, ArrowRight, AlertCircle } from 'lucide-react';

interface RecommendedCollege {
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
}

interface PredictorResult {
  id: string;
  courseName: string;
  closingRank: number;
  quota: string;
  category: string;
  exam: string;
  college: RecommendedCollege;
  admissionChance: 'High' | 'Medium' | 'Low';
}

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [quota, setQuota] = useState('All India');
  
  const [results, setResults] = useState<PredictorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handlePredictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);

    if (!rank || isNaN(parseInt(rank)) || parseInt(rank) <= 0) {
      setError('Please enter a valid positive rank number.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({
        exam,
        rank,
        category,
        quota,
      });

      const res = await fetch(`/api/predictor?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch recommendations.');
      }
    } catch (err) {
      setError('An error occurred during rank prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <span>Rank Predictor Tool</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your rank, entrance exam, category, and state quota, and we will find matching courses from historical cutoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Panel */}
        <div className="h-fit rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
          <h2 className="text-base font-bold text-slate-950 dark:text-white mb-6">Enter Your Score Details</h2>
          
          <form onSubmit={handlePredictSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Exam */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Entrance Exam</label>
              <select
                value={exam}
                onChange={(e) => {
                  setExam(e.target.value);
                  // Auto set default quota if exam is BITSAT/NEET
                  if (e.target.value === 'BITSAT' || e.target.value === 'NEET' || e.target.value === 'VITEEE' || e.target.value === 'JEE Advanced') {
                    setQuota('All India');
                  }
                }}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="JEE Main">JEE Main (for NITs, DTU, State Govts)</option>
                <option value="JEE Advanced">JEE Advanced (for IITs)</option>
                <option value="NEET">NEET (for Medical/AIIMS)</option>
                <option value="BITSAT">BITSAT (for BITS Pilani)</option>
                <option value="VITEEE">VITEEE (for VIT Vellore)</option>
              </select>
            </div>

            {/* Rank */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Rank / Score</label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5000"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            {/* Quota */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quota Type</label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                disabled={exam === 'BITSAT' || exam === 'VITEEE' || exam === 'NEET' || exam === 'JEE Advanced'}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="All India">All India / Other State (Default)</option>
                <option value="Home State">Home State Quota (e.g. NITs, DTU)</option>
              </select>
              {(exam === 'BITSAT' || exam === 'VITEEE' || exam === 'NEET' || exam === 'JEE Advanced') && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Quota filter is disabled as this exam operates on All India seats only.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Analyzing data...' : 'Predict Recommended Colleges'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-xs font-semibold text-slate-500">Matching your rank with historical data points...</p>
              </div>
            </div>
          ) : !searched ? (
            /* Not searched yet */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 h-full min-h-[350px]">
              <Compass className="h-12 w-12 text-slate-300 dark:text-slate-700" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Recommendations Will Appear Here</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Enter your entrance score, exam rank, category, and state details in the left form panel to run the cutoff prediction matching.
              </p>
            </div>
          ) : results.length === 0 ? (
            /* No results match */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 h-full min-h-[350px]">
              <AlertCircle className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No Matching Colleges Found</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                We couldn't find any courses with a historical closing rank greater than or equal to {rank} for the {exam} ({category} category). Your rank might be above the seeded cutoff boundaries. Try entering a better rank.
              </p>
            </div>
          ) : (
            /* Results list */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Matches found: {results.length} colleges & branches
                </span>
              </div>

              {results.map((res) => {
                const colorMap = {
                  High: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
                  Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
                  Low: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/50',
                };
                
                return (
                  <div
                    key={res.id}
                    className="group rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {res.college.type} Institute
                        </span>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${colorMap[res.admissionChance]}`}>
                          {res.admissionChance} Admission Chance
                        </span>
                      </div>
                      <h3 className="mt-1 font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        <Link href={`/colleges/${res.college.id}`}>{res.courseName}</Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Landmark className="h-3.5 w-3.5" />
                        <span>{res.college.name}</span>
                      </p>
                      
                      <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {res.college.city}, {res.college.state}
                        </span>
                        <span>•</span>
                        <span>Fees: {formatCurrency(res.college.fees)}/yr</span>
                        <span>•</span>
                        <span>Avg Salary: {res.college.placementMedian.toFixed(1)} LPA</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-start md:items-end text-left md:text-right border-t md:border-t-0 border-slate-100 dark:border-slate-850 pt-4 md:pt-0 w-full md:w-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Historic Closing Cutoff</span>
                      <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{res.closingRank}</span>
                      <Link
                        href={`/colleges/${res.college.id}`}
                        className="mt-3 inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
                      >
                        <span>View Details</span>
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
