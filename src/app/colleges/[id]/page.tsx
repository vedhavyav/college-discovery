'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Landmark, Award, Star, DollarSign, Calendar, Heart, GitCompare, BookOpen, Send, User, MessageSquare, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  eligibility: string;
}

interface Placement {
  id: string;
  year: number;
  averagePackage: number;
  highestPackage: number;
  topRecruiters: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Cutoff {
  id: string;
  exam: string;
  category: string;
  quota: string;
  courseName: string;
  closingRank: number;
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
  reviews: Review[];
  cutoffs: Cutoff[];
}

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Shortlist and Compare states
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const fetchCollegeDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/colleges/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollegeDetails();
  }, [fetchCollegeDetails]);

  // Load shortlist/compare status
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem('shortlisted_colleges');
      if (savedShortlist) {
        const parsed = JSON.parse(savedShortlist);
        setIsShortlisted(parsed.some((c: any) => c.id === id));
      }

      const savedCompare = localStorage.getItem('compare_colleges');
      if (savedCompare) {
        const parsed = JSON.parse(savedCompare);
        setIsComparing(parsed.includes(id));
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const toggleShortlist = () => {
    if (!college) return;
    let list: College[] = [];
    try {
      const saved = localStorage.getItem('shortlisted_colleges');
      if (saved) list = JSON.parse(saved);
    } catch (err) {}

    const exists = list.some((item) => item.id === college.id);
    let updatedList: College[];
    if (exists) {
      updatedList = list.filter((item) => item.id !== college.id);
      setIsShortlisted(false);
    } else {
      updatedList = [...list, college];
      setIsShortlisted(true);
    }

    localStorage.setItem('shortlisted_colleges', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('shortlistUpdated'));
  };

  const toggleCompare = () => {
    if (!college) return;
    let list: string[] = [];
    try {
      const saved = localStorage.getItem('compare_colleges');
      if (saved) list = JSON.parse(saved);
    } catch (err) {}

    const exists = list.includes(college.id);
    let updatedList: string[];
    if (exists) {
      updatedList = list.filter((id) => id !== college.id);
      setIsComparing(false);
    } else {
      if (list.length >= 3) {
        alert('You can compare up to 3 colleges at once.');
        return;
      }
      updatedList = [...list, college.id];
      setIsComparing(true);
    }

    localStorage.setItem('compare_colleges', JSON.stringify(updatedList));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!reviewName.trim()) {
      setReviewError('Please enter your name.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/colleges/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        // Refresh college details to pull new review & recalculated score
        fetchCollegeDetails();
      } else {
        const errorData = await res.json();
        setReviewError(errorData.error || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('An error occurred. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">College Not Found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">The college you are looking for does not exist or has been removed.</p>
        <Link href="/colleges" className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1.5 items-center">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/colleges" className="hover:text-indigo-600">Colleges</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900 dark:text-white line-clamp-1">{college.name}</span>
      </nav>

      {/* Hero Banner Area */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950 shadow-sm">
        {/* Cover image */}
        <div className="h-48 md:h-64 w-full bg-slate-100 dark:bg-slate-900 relative">
          {college.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={college.coverUrl}
              alt={college.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>

        {/* Header content overlay */}
        <div className="relative p-6 md:p-8 -mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
            {/* Logo placeholder */}
            <div className="h-24 w-24 rounded-2xl bg-white p-2 shadow-md ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 flex items-center justify-center shrink-0">
              {college.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={college.logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <Landmark className="h-10 w-10 text-slate-400" />
              )}
            </div>
            
            <div className="text-left">
              <span className="inline-flex rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
                {college.type} Institute
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {college.name}
              </h1>
              
              {/* Meta tags */}
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {college.city}, {college.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Estd. {college.established}
                </span>
                {college.ranking && (
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <Award className="h-4 w-4" />
                    NIRF #{college.ranking}
                  </span>
                )}
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  {college.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={toggleCompare}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                isComparing
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <GitCompare className="h-4 w-4" />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
            <button
              onClick={toggleShortlist}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                isShortlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Heart className={`h-4 w-4 ${isShortlisted ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="mt-8 flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {(['overview', 'courses', 'placements', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-3.5 text-sm font-bold border-b-2 capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab === 'placements' ? 'Placements & Cutoffs' : tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Overview text */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">About the University</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-350">{college.overview}</p>
              </div>

              {/* Statistics Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm dark:border-slate-800/50 dark:bg-slate-950 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NIRF Rank</span>
                  <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {college.ranking ? `#${college.ranking}` : 'N/A'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm dark:border-slate-800/50 dark:bg-slate-950 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Established</span>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{college.established}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm dark:border-slate-800/50 dark:bg-slate-950 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Rating</span>
                  <p className="mt-1 text-2xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{college.rating.toFixed(1)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar quick info */}
            <div>
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h3 className="font-bold text-slate-950 dark:text-white">Fee Structure & Stats</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500">Average Annual Fees</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(college.fees)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500">Median Placement package</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.placementMedian.toFixed(1)} LPA</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500">Highest Placement package</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.placementHighest.toFixed(1)} LPA</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-slate-500">Total Courses offered</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.courses.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Offered Courses & Fee Structure</h2>
            
            {college.courses.length === 0 ? (
              <p className="text-sm text-slate-500">No courses listed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {college.courses.map((course) => (
                  <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{course.name}</span>
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Duration: {course.duration}</span>
                        <span>•</span>
                        <span>Eligibility: {course.eligibility}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Annual Fees</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(course.fees)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="space-y-8">
            {/* Placement stats */}
            <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Placement Statistics</h2>
              {college.placements.length === 0 ? (
                <p className="text-sm text-slate-500">No placement history listed yet.</p>
              ) : (
                <div className="space-y-8">
                  {college.placements.map((placement) => (
                    <div key={placement.id} className="border-b last:border-0 border-slate-100 dark:border-slate-800 pb-6 last:pb-0">
                      <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Academic Year {placement.year} Batch</span>
                      </h3>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 flex items-center gap-4">
                          <DollarSign className="h-8 w-8 text-emerald-500" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Salary Package</span>
                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{placement.averagePackage.toFixed(1)} LPA</p>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 flex items-center gap-4">
                          <DollarSign className="h-8 w-8 text-indigo-500" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Salary Package</span>
                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{placement.highestPackage.toFixed(1)} LPA</p>
                          </div>
                        </div>
                      </div>
                      
                      {placement.topRecruiters && (
                        <div className="mt-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Recruiters</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {placement.topRecruiters.split(',').map((rec, i) => (
                              <span key={i} className="rounded-lg bg-indigo-50/50 border border-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-300">
                                {rec.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cutoffs matching table */}
            <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Historical Cutoff Closing Ranks</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Historic seat closing ranks based on General category (All India/Home State quota).
              </p>
              
              {college.cutoffs.length === 0 ? (
                <p className="text-sm text-slate-500">No cutoff rankings listed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Course / Branch</th>
                        <th className="pb-3">Exam</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Quota</th>
                        <th className="pb-3 text-right">Closing Cutoff Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {college.cutoffs.map((cut) => (
                        <tr key={cut.id} className="text-slate-700 dark:text-slate-300">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{cut.courseName}</td>
                          <td className="py-3">{cut.exam}</td>
                          <td className="py-3">{cut.category}</td>
                          <td className="py-3">{cut.quota}</td>
                          <td className="py-3 text-right font-extrabold text-indigo-600 dark:text-indigo-400">{cut.closingRank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Reviews list */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Student & Alumni Feedback</h2>
                
                {college.reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No reviews yet. Be the first to add one!</p>
                ) : (
                  <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                    {college.reviews.map((rev) => (
                      <div key={rev.id} className="pt-6 first:pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{rev.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-350 leading-relaxed pl-10">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Write a Review box */}
            <div>
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h3 className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-indigo-600" />
                  <span>Write a Review</span>
                </h3>
                
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                  {reviewError && (
                    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40">
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                      Review submitted successfully!
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-500">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priyan Bose"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500">Rating (1 to 5 Stars)</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Very Bad)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500">Comments</label>
                    <textarea
                      rows={4}
                      placeholder="Share your experience regarding campus life, placements, or hostel reviews..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
