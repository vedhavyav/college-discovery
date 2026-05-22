'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, GraduationCap, GitCompare, Compass, MessageSquare, Landmark, Award, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  const features = [
    {
      title: 'College Discovery',
      description: 'Search over top universities. Filter by location, fees, streams, and ratings.',
      icon: GraduationCap,
      href: '/colleges',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Side-by-Side Compare',
      description: 'Compare fees, placement packages, ratings, and course details for up to 3 colleges.',
      icon: GitCompare,
      href: '/compare',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Rank Predictor',
      description: 'Enter your JEE Main, Advanced, or NEET ranks to find matches from historical cutoffs.',
      icon: Compass,
      href: '/predictor',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Student Q&A Board',
      description: 'Ask questions about fees, hostels, and academic life, and get answers from alumni.',
      icon: MessageSquare,
      href: '/discussions',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  const categories = [
    { name: 'IITs (IIT Bombay, IIT Delhi...)', query: '/colleges?search=Indian+Institute+of+Technology' },
    { name: 'NITs (NIT Trichy...)', query: '/colleges?search=National+Institute+of+Technology' },
    { name: 'Top Rated Colleges (4.5+ ★)', query: '/colleges?minRating=4.5' },
    { name: 'Private Universities (BITS, VIT...)', query: '/colleges?type=Private' },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 py-20 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950/30 dark:text-indigo-400">
            <Landmark className="h-3 w-3" />
            Discover Your Future College
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Find the Perfect College <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
              Aligning with Your Rank & Career
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Explore fees, placement reports, ratings, and course cutoffs. Compare campus details side-by-side or predict admission chances instantly.
          </p>

          {/* Large Search Box */}
          <form onSubmit={handleSearchSubmit} className="mx-auto mt-10 max-w-2xl">
            <div className="relative flex items-center rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges (e.g. IIT Bombay, BITS Pilani, NIT Trichy)..."
                className="w-full rounded-2xl border-0 bg-transparent py-4 pl-12 pr-32 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick categories chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 self-center">Popular:</span>
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.query}
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Streamlined Decision Making
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Empowering students with verified college analytics, historical data points, and community discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={i}
                href={feature.href}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-800/60 dark:bg-slate-950 dark:hover:border-indigo-500/30 transition-all duration-300"
              >
                <div>
                  <div className={`inline-flex rounded-2xl p-3 ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Now</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Call to Action for Predictor */}
      <section className="w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 to-indigo-800 px-6 py-12 shadow-xl sm:px-12 sm:py-16 md:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-700/50 via-transparent to-transparent"></div>
          <div className="relative max-w-2xl text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Unsure about which colleges match your rank?
            </h2>
            <p className="mt-4 text-indigo-200">
              Input your entrance exam rank (JEE Main, Advanced, NEET, etc.) and category. Our Predictor matches you with historical college seat closing data from standard rounds.
            </p>
            <div className="mt-8">
              <Link
                href="/predictor"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 transition-colors"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Rank Predictor</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
