'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, DollarSign, Star, Award, Heart, Check, GitCompare, Filter, RefreshCw, ChevronLeft, ChevronRight, Landmark, GraduationCap } from 'lucide-react';

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

function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Data States
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Shortlist and Compare tracking
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Unique lists for filters (loaded dynamically from API response)
  const [statesList, setStatesList] = useState<string[]>([]);

  // Fetch colleges from API
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (state) params.append('state', state);
      if (type) params.append('type', type);
      if (minRating) params.append('minRating', minRating);
      if (maxFees) params.append('maxFees', maxFees);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '6');

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        if (data.states) {
          setStatesList(data.states);
        }
      }
    } catch (err) {
      console.error('Failed to fetch colleges', err);
    } finally {
      setLoading(false);
    }
  }, [search, state, type, minRating, maxFees, sortBy, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Load initial shortlist and compare list from localStorage
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem('shortlisted_colleges');
      if (savedShortlist) {
        const parsed = JSON.parse(savedShortlist);
        setShortlistedIds(parsed.map((c: any) => c.id));
      }

      const savedCompare = localStorage.getItem('compare_colleges');
      if (savedCompare) {
        setCompareIds(JSON.parse(savedCompare));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  };

  const handleResetFilters = () => {
    setSearch('');
    setState('');
    setType('');
    setMinRating('');
    setMaxFees('');
    setSortBy('');
    setPage(1);
    router.push('/colleges');
  };

  const toggleShortlist = (college: College) => {
    let list: College[] = [];
    try {
      const saved = localStorage.getItem('shortlisted_colleges');
      if (saved) list = JSON.parse(saved);
    } catch (err) {}

    const exists = list.some((item) => item.id === college.id);
    let updatedList: College[];
    if (exists) {
      updatedList = list.filter((item) => item.id !== college.id);
      setShortlistedIds(shortlistedIds.filter((id) => id !== college.id));
    } else {
      updatedList = [...list, college];
      setShortlistedIds([...shortlistedIds, college.id]);
    }

    localStorage.setItem('shortlisted_colleges', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('shortlistUpdated'));
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Explore Colleges</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Compare packages, ratings, fees, and location details of top institutes.
          </p>
        </div>
        
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex max-w-md w-full items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-950 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h2 className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
              <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* State Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">State</label>
              <select
                value={state}
                onChange={(e) => { setState(e.target.value); setPage(1); }}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="">All States</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">University Type</label>
              <div className="mt-2 flex flex-col gap-2">
                {['Government', 'Private'].map((tp) => (
                  <button
                    key={tp}
                    onClick={() => { setType(type === tp ? '' : tp); setPage(1); }}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                      type === tp
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/20 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tp}</span>
                    {type === tp && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fees Limit */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Max Annual Fees</label>
              <select
                value={maxFees}
                onChange={(e) => { setMaxFees(e.target.value); setPage(1); }}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="">No Limit</option>
                <option value="5000">Under ₹5,000</option>
                <option value="150000">Under ₹1.5 Lakh</option>
                <option value="300000">Under ₹3 Lakh</option>
                <option value="600000">Under ₹6 Lakh</option>
              </select>
            </div>

            {/* Ratings Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="">Any Rating</option>
                <option value="4.8">4.8+ Excellent</option>
                <option value="4.5">4.5+ Very Good</option>
                <option value="4.0">4.0+ Good</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="">Default (NIRF Rank)</option>
                <option value="fees_asc">Fees: Low to High</option>
                <option value="fees_desc">Fees: High to Low</option>
                <option value="rating_desc">Ratings: High to Low</option>
                <option value="placement_desc">Median Package: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950">
                  <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-900"></div>
                  <div className="mt-4 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-900"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-900"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 rounded bg-slate-200 dark:bg-slate-900"></div>
                    <div className="h-4 rounded bg-slate-200 dark:bg-slate-900"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
              <GraduationCap className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No Colleges Found</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                We couldn't find any colleges matching your active filter criteria. Try resetting or adjusting.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results count info */}
              <div className="mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing {colleges.length} of {totalCount} matching colleges
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {colleges.map((college) => {
                  const isShortlisted = shortlistedIds.includes(college.id);
                  const isComparing = compareIds.includes(college.id);
                  
                  return (
                    <div
                      key={college.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
                    >
                      {/* Cover & Rating badge */}
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

                        {/* Ranking tag */}
                        {college.ranking && (
                          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-indigo-500">
                            <Award className="h-3.5 w-3.5" />
                            <span>NIRF #{college.ranking}</span>
                          </div>
                        )}
                      </div>

                      {/* Content details */}
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
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Median Placement</span>
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
                          {/* Compare button */}
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
                          
                          {/* Shortlist button */}
                          <button
                            onClick={() => toggleShortlist(college)}
                            className={`rounded-xl p-2.5 transition-all duration-200 border ${
                              isShortlisted
                                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                            title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                          >
                            <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:disabled:hover:bg-slate-950 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:disabled:hover:bg-slate-950 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    }>
      <CollegesContent />
    </Suspense>
  );
}
