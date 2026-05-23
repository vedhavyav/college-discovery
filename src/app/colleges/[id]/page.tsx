'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Landmark, Award, Star, DollarSign, Calendar, Heart, GitCompare, BookOpen, Send, User, MessageSquare, ChevronRight, GraduationCap, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

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

interface Cutoff {
  id: string;
  exam: string;
  category: string;
  quota: string;
  courseName: string;
  closingRank: number;
}

interface Scholarship {
  id: string;
  name: string;
  amount: number | null;
  description: string;
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
  domain: string;
  overview: string;
  courses: Course[];
  placements: Placement[];
  cutoffs: Cutoff[];
  scholarships: Scholarship[];
}

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'admission' | 'cutoff' | 'placements' | 'scholarships'>('overview');
  
  // Similar colleges state
  const [similarColleges, setSimilarColleges] = useState<College[]>([]);

  // Shortlist and Compare states
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const fetchCollegeDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/colleges/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data);
        
        // Fetch similar colleges under same domain
        const similarRes = await fetch(`/api/colleges?domain=${data.domain}&limit=4`);
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          // Filter out current college
          const filtered = (similarData.colleges as College[]).filter((c) => c.id !== data.id).slice(0, 3);
          setSimilarColleges(filtered);
        }
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
      updatedList = list.filter((cid) => cid !== college.id);
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

  // Get accepted exams text dynamically based on cutoffs
  const getAcceptedExams = () => {
    const examsSet = new Set(college.cutoffs.map((c) => c.exam));
    if (examsSet.size === 0) {
      if (college.domain === 'Engineering') return 'JEE Main, BITSAT, or VITEEE';
      if (college.domain === 'Management') return 'CAT / XAT';
      return 'NEET';
    }
    return Array.from(examsSet).join(', ');
  };

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
                {college.type} • {college.domain}
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

      {/* Tab Navigation links */}
      <div className="mt-8 flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {(['overview', 'courses', 'admission', 'cutoff', 'placements', 'scholarships'] as const).map((tab) => {
          let label: string = tab;
          if (tab === 'courses') label = 'Courses & Fees';
          if (tab === 'admission') label = 'Admission through';
          if (tab === 'cutoff') label = 'Cutoff Ranks';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="mt-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Overview Left column */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">About the University</h2>
                <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-650 dark:text-slate-350">{college.overview}</p>
              </div>

              {/* Similar Colleges Section */}
              {similarColleges.length > 0 && (
                <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                  <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-6">Similar Colleges</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {similarColleges.map((sim) => (
                      <div
                        key={sim.id}
                        className="rounded-2xl border border-slate-250/50 bg-slate-50/20 p-4 shadow-sm dark:border-slate-800/55 dark:bg-slate-900/10 text-center flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-10 w-10 mx-auto rounded-lg bg-white p-1 border flex items-center justify-center dark:bg-slate-950 dark:border-slate-800 shrink-0">
                            {sim.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sim.logoUrl} alt="Logo" className="h-full w-full object-cover rounded-md" />
                            ) : (
                              <Landmark className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <h3 className="mt-3 font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {sim.name}
                          </h3>
                          <p className="mt-1 text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{sim.city}, {sim.state}</span>
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                          <Link
                            href={`/colleges/${sim.id}`}
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-indigo-500"
                          >
                            Explore
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Overview Right column */}
            <div>
              <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
                <h3 className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Fee Structure & Stats</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-500">Average Annual Fees</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(college.fees)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-500">Median package</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.placementMedian.toFixed(1)} LPA</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-500">Highest package</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.placementHighest.toFixed(1)} LPA</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-semibold text-slate-500">Total Courses</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{college.courses.length} Tracks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES & FEES TAB */}
        {activeTab === 'courses' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-6">Offered Courses & Fees</h2>
            
            {college.courses.length === 0 ? (
              <p className="text-xs text-slate-550">No courses listed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-900">
                {college.courses.map((course) => (
                  <div key={course.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{course.name}</span>
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span>Duration: {course.duration}</span>
                        <span>•</span>
                        <span>Eligibility: {course.eligibility}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Annual Fees</span>
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{formatCurrency(course.fees)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMISSION THROUGH TAB */}
        {activeTab === 'admission' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-6">Admission Criteria & Exams</h2>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <Compass className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Accepted Entrance Examinations</h3>
                  <p className="mt-1 text-xs text-slate-550 leading-relaxed">
                    This institute accepts scores from: <span className="font-bold text-indigo-600 dark:text-indigo-400">{getAcceptedExams()}</span>. Admission is strictly based on national counselling rounds (e.g. JoSAA for IITs/NITs, MCC for medical institutes, or CAT counseling for IIMs).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6 dark:border-slate-850">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">General Eligibility Criteria</h3>
                  <ul className="mt-2 text-xs text-slate-550 leading-relaxed list-disc pl-4 space-y-1">
                    <li>Candidates must qualify Class 12 (or equivalent graduation for MBA) with aggregate marks as per guidelines.</li>
                    <li>For engineering programs, physics, chemistry, and mathematics (PCM) are mandatory subjects.</li>
                    <li>For medical programs, physics, chemistry, biology (PCB), and English are mandatory.</li>
                    <li>For management post-graduate studies, a recognized Bachelor degree in any discipline is required.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6 dark:border-slate-850">
                <ShieldCheck className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admission Process Workflow</h3>
                  <p className="mt-1 text-xs text-slate-550 leading-relaxed">
                    1. Fill out the corresponding exam registration form.<br />
                    2. Secure the cutoff requirements in the exam.<br />
                    3. Join the respective centralized counselling portal and choose this college during option entry.<br />
                    4. Post seat allocation, report to campus with documents for physical verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUTOFF RANKS TAB */}
        {activeTab === 'cutoff' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-4">Historical Cutoff Closing Ranks</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Cutoffs based on the General category (All India/Home State quota). For CAT, numbers correspond to percentile scores.
            </p>
            
            {college.cutoffs.length === 0 ? (
              <p className="text-xs text-slate-550">No cutoff rankings listed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-450">
                      <th className="pb-3">Course / Branch</th>
                      <th className="pb-3">Exam</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Quota</th>
                      <th className="pb-3 text-right">Closing Cutoff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {college.cutoffs.map((cut) => (
                      <tr key={cut.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">{cut.courseName}</td>
                        <td className="py-3">{cut.exam}</td>
                        <td className="py-3">{cut.category}</td>
                        <td className="py-3">{cut.quota}</td>
                        <td className="py-3 text-right font-extrabold text-indigo-600 dark:text-indigo-400">
                          {college.domain === 'Management' ? `${cut.closingRank}%ile` : cut.closingRank}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PLACEMENTS TAB */}
        {activeTab === 'placements' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-6">Placement Statistics</h2>
            {college.placements.length === 0 ? (
              <p className="text-xs text-slate-550">No placement history listed yet.</p>
            ) : (
              <div className="space-y-6">
                {college.placements.map((placement) => (
                  <div key={placement.id} className="pb-6 last:pb-0 border-b last:border-0 border-slate-100 dark:border-slate-900">
                    <h3 className="font-bold text-xs text-indigo-700 dark:text-indigo-455 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Academic Year {placement.year} Batch</span>
                    </h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/30 flex items-center gap-4 border border-slate-100 dark:border-slate-900">
                        <DollarSign className="h-8 w-8 text-emerald-500" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Salary Package</span>
                          <p className="text-base font-extrabold text-slate-900 dark:text-white">{placement.averagePackage.toFixed(1)} LPA</p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/30 flex items-center gap-4 border border-slate-100 dark:border-slate-900">
                        <DollarSign className="h-8 w-8 text-indigo-500" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Salary Package</span>
                          <p className="text-base font-extrabold text-slate-900 dark:text-white">{placement.highestPackage.toFixed(1)} LPA</p>
                        </div>
                      </div>
                    </div>
                    
                    {placement.topRecruiters && (
                      <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Recruiters</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {placement.topRecruiters.split(',').map((rec, i) => (
                            <span key={i} className="rounded-lg bg-indigo-50/50 border border-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-300">
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
        )}

        {/* SCHOLARSHIPS TAB */}
        {activeTab === 'scholarships' && (
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-950">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-6">Financial Aid & Scholarships</h2>
            
            {college.scholarships.length === 0 ? (
              <p className="text-xs text-slate-550">No scholarship programs listed for this college.</p>
            ) : (
              <div className="space-y-6">
                {college.scholarships.map((sch) => (
                  <div key={sch.id} className="pb-6 last:pb-0 border-b last:border-0 border-slate-100 dark:border-slate-900">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{sch.name}</span>
                    </h3>
                    <p className="mt-2 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                      {sch.description}
                    </p>
                    {sch.amount && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual reward:</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(sch.amount)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
