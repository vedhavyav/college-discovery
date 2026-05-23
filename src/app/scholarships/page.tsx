'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Search, Landmark, MapPin, Star, DollarSign, Info } from 'lucide-react';

interface College {
  id: string;
  name: string;
  domain: string;
  city: string;
  state: string;
}

interface Scholarship {
  id: string;
  name: string;
  amount: number | null;
  description: string;
  college: College;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const data = await res.json();
          setScholarships(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

  const filteredScholarships = scholarships.filter((sch) => {
    return (
      sch.name.toLowerCase().includes(search.toLowerCase()) ||
      sch.college.name.toLowerCase().includes(search.toLowerCase()) ||
      sch.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Scholarship Finder</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Browse through financial aid, tuition waivers, and merit scholarship programs offered by leading colleges.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="relative flex items-center rounded-xl bg-white border border-slate-200 focus-within:border-indigo-600 dark:bg-slate-950 dark:border-slate-800">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scholarship or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <Award className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No scholarships match your search</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            We couldn't find any financial aid programs matching "{search}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredScholarships.map((sch) => (
            <div
              key={sch.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {sch.college.domain} Domain Scholarship
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                  {sch.name}
                </h3>

                {/* College Info */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Landmark className="h-4 w-4 text-slate-400" />
                    <Link href={`/colleges/${sch.college.id}`} className="hover:underline">
                      {sch.college.name}
                    </Link>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {sch.college.city}, {sch.college.state}
                  </span>
                </div>

                {/* Description */}
                <div className="mt-5 flex gap-2.5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                  <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligibility & Description</span>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{sch.description}</p>
                  </div>
                </div>
              </div>

              {/* Amount and Link */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual Value / Reward</span>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center">
                    <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
                    <span>{sch.amount ? formatCurrency(sch.amount) : 'Tuition Fee Waiver / Variable'}</span>
                  </p>
                </div>
                <Link
                  href={`/colleges/${sch.college.id}`}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
