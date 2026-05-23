'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Landmark, MapPin, Star, GraduationCap, Clock, Award } from 'lucide-react';

interface College {
  id: string;
  name: string;
  domain: string;
  city: string;
  state: string;
  rating: number;
}

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  eligibility: string;
  college: College;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDomain, setActiveDomain] = useState<'All' | 'Engineering' | 'Medical' | 'Management'>('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.college.name.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = activeDomain === 'All' || course.college.domain === activeDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Courses Directory</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Explore academic degree tracks, durations, fees, and eligibility across premier institutes.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="relative flex items-center rounded-xl bg-white border border-slate-200 focus-within:border-indigo-600 dark:bg-slate-950 dark:border-slate-800">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses or colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Domain Quick Filters */}
      <div className="mb-8 flex flex-wrap gap-2.5">
        {(['All', 'Engineering', 'Medical', 'Management'] as const).map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
              activeDomain === domain
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            {domain === 'All' ? 'All Domains' : domain}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No courses match your query</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            We couldn't find any courses matching "{search}" under {activeDomain === 'All' ? 'any domain' : activeDomain}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                {/* Domain Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {course.college.domain}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{course.college.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="mt-2 font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Landmark className="h-4 w-4 text-slate-400 shrink-0" />
                    <Link href={`/colleges/${course.college.id}`} className="hover:underline line-clamp-1">
                      {course.college.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{course.college.city}, {course.college.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Award className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">Eligibility: {course.eligibility}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual Fees</span>
                  <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatCurrency(course.fees)}</p>
                </div>
                <Link
                  href={`/colleges/${course.college.id}`}
                  className="rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-indigo-50 hover:text-indigo-600 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 transition-all"
                >
                  View College
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
