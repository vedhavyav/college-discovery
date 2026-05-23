'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Search, ArrowRight, FileText, Download, CheckCircle, GraduationCap } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter((res) => 
    res.title.toLowerCase().includes(search.toLowerCase()) ||
    res.category.toLowerCase().includes(search.toLowerCase()) ||
    res.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>Preparation Resources</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Access revision materials, practice test booklets, and preparation guides compiled by toppers and teachers.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="relative flex items-center rounded-xl bg-white border border-slate-200 focus-within:border-indigo-600 dark:bg-slate-950 dark:border-slate-800">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, books, revision tags..."
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
      ) : filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No resources matched your search</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            We couldn't find any resources matching "{search}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-55/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                  <FileText className="h-3.5 w-3.5" />
                  {res.category}
                </span>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-650 dark:text-slate-350">
                  {res.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Free Download PDF</span>
                </span>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resource</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
