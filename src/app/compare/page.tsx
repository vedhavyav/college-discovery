'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GitCompare, Landmark, MapPin, Star, Award, DollarSign, Calendar, Trash2, Search, Plus, Check } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

interface Placement {
  id: string;
  year: number;
  averagePackage: number;
  highestPackage: number;
}

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
  courses: Course[];
  placements: Placement[];
}

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Search input for adding a college
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch full details for compared colleges
  const fetchCompareDetails = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const details = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/colleges/${id}`);
          if (res.ok) {
            return await res.json();
          }
          return null;
        })
      );
      setColleges(details.filter((c) => c !== null) as College[]);
    } catch (err) {
      console.error('Failed to fetch comparison details', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load compared IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('compare_colleges');
      if (saved) {
        const ids = JSON.parse(saved);
        setCompareIds(ids);
        fetchCompareDetails(ids);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [fetchCompareDetails]);

  // Search colleges to add to comparison
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    setShowDropdown(true);
    try {
      const res = await fetch(`/api/colleges?search=${encodeURIComponent(val)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.colleges);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const addCollegeToCompare = (collegeId: string) => {
    if (compareIds.includes(collegeId)) {
      setShowDropdown(false);
      setSearchQuery('');
      return;
    }
    if (compareIds.length >= 3) {
      alert('You can compare up to 3 colleges at once.');
      setShowDropdown(false);
      setSearchQuery('');
      return;
    }

    const updatedIds = [...compareIds, collegeId];
    setCompareIds(updatedIds);
    localStorage.setItem('compare_colleges', JSON.stringify(updatedIds));
    fetchCompareDetails(updatedIds);

    // Clear input
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const removeCollegeFromCompare = (collegeId: string) => {
    const updatedIds = compareIds.filter((id) => id !== collegeId);
    setCompareIds(updatedIds);
    localStorage.setItem('compare_colleges', JSON.stringify(updatedIds));
    setColleges(colleges.filter((c) => c.id !== collegeId));
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  // Metric Comparison Highlighting Helpers
  const getBestFeesIndex = () => {
    if (colleges.length < 2) return -1;
    const feesList = colleges.map((c) => c.fees);
    const minFees = Math.min(...feesList);
    return feesList.indexOf(minFees);
  };

  const getBestPlacementIndex = () => {
    if (colleges.length < 2) return -1;
    const placementList = colleges.map((c) => c.placementMedian);
    const maxPlacement = Math.max(...placementList);
    return placementList.indexOf(maxPlacement);
  };

  const getBestRatingIndex = () => {
    if (colleges.length < 2) return -1;
    const ratingList = colleges.map((c) => c.rating);
    const maxRating = Math.max(...ratingList);
    return ratingList.indexOf(maxRating);
  };

  const bestFeesIdx = getBestFeesIndex();
  const bestPlacementIdx = getBestPlacementIndex();
  const bestRatingIdx = getBestRatingIndex();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Compare Colleges</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Analyze fees, placements, ratings, and course limits side-by-side to make informed choices.
          </p>
        </div>

        {/* Add College Search Box */}
        {compareIds.length < 3 && (
          <div className="relative max-w-md w-full">
            <div className="relative flex items-center rounded-xl bg-white border border-slate-200 focus-within:border-indigo-600 dark:bg-slate-950 dark:border-slate-800">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search and add a college..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
            </div>

            {/* Results Dropdown */}
            {showDropdown && searchQuery && (
              <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                {searching ? (
                  <div className="py-2.5 px-4 text-xs font-semibold text-slate-500">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="py-2.5 px-4 text-xs font-semibold text-slate-500">No results found</div>
                ) : (
                  searchResults.map((result) => {
                    const isAdded = compareIds.includes(result.id);
                    return (
                      <button
                        key={result.id}
                        onClick={() => addCollegeToCompare(result.id)}
                        disabled={isAdded}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{result.name}</p>
                          <p className="text-[10px] text-slate-500">{result.city}, {result.state}</p>
                        </div>
                        {isAdded ? (
                          <span className="text-[10px] text-indigo-600 font-bold">Added</span>
                        ) : (
                          <Plus className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : colleges.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <GitCompare className="h-16 w-12 text-slate-400 animate-pulse" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Compare side-by-side</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Select up to 3 colleges from our directories or search above to compare their fees, placement standards, established dates, and state positions.
          </p>
          <Link href="/colleges" className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Browse Colleges
          </Link>
        </div>
      ) : (
        /* Comparison Grid */
        <div className="overflow-x-auto">
          <div className="min-w-[768px] grid grid-cols-4 gap-6 bg-slate-50/30 p-4 rounded-3xl dark:bg-slate-900/10">
            
            {/* Headers Column */}
            <div className="flex flex-col justify-between py-6">
              <div className="h-48 flex items-center">
                <span className="font-bold text-sm text-slate-500">Comparison Matrix</span>
              </div>
              <div className="space-y-12 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Rating</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">NIRF Ranking</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Annual Fees</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Median Salary</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest Salary</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Established</div>
              </div>
            </div>

            {/* Colleges Columns */}
            {colleges.map((college, idx) => (
              <div key={college.id} className="relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/50 p-6 shadow-sm dark:bg-slate-950 dark:border-slate-800/50">
                {/* Trash button */}
                <button
                  onClick={() => removeCollegeFromCompare(college.id)}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition-all duration-200"
                  title="Remove from comparison"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* College basic info */}
                <div className="h-48 flex flex-col justify-center text-left">
                  <div className="h-14 w-14 rounded-xl bg-slate-50 p-1 border flex items-center justify-center dark:bg-slate-900 dark:border-slate-800 shrink-0">
                    {college.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={college.logoUrl} alt="logo" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <Landmark className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <h3 className="mt-4 font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    <Link href={`/colleges/${college.id}`} className="hover:underline">{college.name}</Link>
                  </h3>
                </div>

                {/* Data values */}
                <div className="space-y-12 border-t border-slate-100 dark:border-slate-800 pt-6 text-left">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{college.rating.toFixed(1)}</span>
                    {idx === bestRatingIdx && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                        Best
                      </span>
                    )}
                  </div>

                  {/* NIRF Rank */}
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{college.ranking ? `#${college.ranking}` : 'N/A'}</span>
                  </div>

                  {/* Fees */}
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>{formatCurrency(college.fees)}</span>
                    {idx === bestFeesIdx && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                        Lowest
                      </span>
                    )}
                  </div>

                  {/* Median Salary */}
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>{college.placementMedian.toFixed(1)} LPA</span>
                    {idx === bestPlacementIdx && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                        Highest
                      </span>
                    )}
                  </div>

                  {/* Highest Salary */}
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    <span>{college.placementHighest.toFixed(1)} LPA</span>
                  </div>

                  {/* Location */}
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{college.city}, {college.state}</span>
                  </div>

                  {/* Type */}
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {college.type}
                  </div>

                  {/* Established */}
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{college.established}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty column if comparing < 3 */}
            {Array.from({ length: Math.max(0, 3 - colleges.length) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 p-6 bg-white/20 dark:border-slate-800/80">
                <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <span className="mt-2 text-xs font-semibold text-slate-400">Select another college</span>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}
