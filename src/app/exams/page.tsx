'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, Award, BookOpen, Search } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  description: string;
  registrationDate: string | null;
  examDate: string | null;
  eligibility: string | null;
  syllabus: string | null;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/exams');
        if (res.ok) {
          const data = await res.json();
          setExams(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => 
    exam.name.toLowerCase().includes(search.toLowerCase()) ||
    exam.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Entrance Exams</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Keep track of major engineering, medical, and management examinations, schedules, and eligibility rules.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="relative flex items-center rounded-xl bg-white border border-slate-200 focus-within:border-indigo-600 dark:bg-slate-950 dark:border-slate-800">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exams..."
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
      ) : filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No exams found</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            We couldn't find any exams matching "{search}".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-sm hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="max-w-3xl">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                    {exam.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
                    {exam.description}
                  </p>
                </div>

                {/* Important Dates Block */}
                <div className="shrink-0 w-full md:w-80 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-5 dark:bg-indigo-950/20 dark:border-indigo-900/40">
                  <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Important Timeline</span>
                  </h3>
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Dates</span>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{exam.registrationDate || 'To Be Announced'}</p>
                    </div>
                    <div className="border-t border-indigo-100/50 pt-3 dark:border-indigo-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Window</span>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{exam.examDate || 'To Be Announced'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility & Syllabus details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6 dark:border-slate-800/80">
                <div className="flex gap-3">
                  <Award className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{exam.eligibility || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BookOpen className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Syllabus Overview</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{exam.syllabus || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
