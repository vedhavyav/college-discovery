'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, GraduationCap, GitCompare, Compass, MessageSquare, Landmark, Award, Star, ArrowRight, BookOpen, ShieldAlert, FileText, Cpu, Briefcase, HeartPulse, MapPin } from 'lucide-react';

interface CollegeHighlight {
  id: string;
  name: string;
  logoUrl: string | null;
  coverUrl: string | null;
  city: string;
  state: string;
  rating: number;
  ranking: number | null;
  placementMedian: number;
  fees: number;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Highlighting states
  const [activeDomain, setActiveDomain] = useState<'Engineering' | 'Medical' | 'Management'>('Engineering');
  const [topColleges, setTopColleges] = useState<CollegeHighlight[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  // Fetch top ranked colleges in active domain
  useEffect(() => {
    const fetchTopColleges = async () => {
      setLoadingColleges(true);
      try {
        const res = await fetch(`/api/colleges?domain=${activeDomain}&limit=3&sortBy=ranking_asc`);
        if (res.ok) {
          const data = await res.json();
          setTopColleges(data.colleges);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchTopColleges();
  }, [activeDomain]);

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
      title: 'Compare Colleges',
      description: 'Compare fees, placement packages, ratings, and course details for up to 3 colleges.',
      icon: GitCompare,
      href: '/colleges', // CTA link
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
      title: 'Q&A Discussions',
      description: 'Ask questions about fees, hostels, and academic life, and get answers from alumni.',
      icon: MessageSquare,
      href: '/discussions',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val}`;
  };

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
              Aligning with Your Score & Career
            </span>
          </h1>
          <p className="mt-6 text-sm md:text-base text-slate-650 dark:text-slate-350 max-w-2xl mx-auto">
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
                placeholder="Search colleges (e.g. IIT Bombay, IIM Ahmedabad, AIIMS)..."
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
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 self-center">Popular Categories:</span>
            <Link
              href="/colleges?domain=Engineering"
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all duration-200"
            >
              IITs, NITs & IIITs
            </Link>
            <Link
              href="/colleges?domain=Management"
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all duration-200"
            >
              IIMs & B-Schools
            </Link>
            <Link
              href="/colleges?domain=Medical"
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all duration-200"
            >
              AIIMS & Medical
            </Link>
          </div>
        </div>
      </section>

      {/* Domain Highlights Card Section */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-850">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ranking & Highlights
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse top-tier institutions certified by NIRF and placement metrics across different streams.
            </p>
          </div>

          {/* Domain tabs */}
          <div className="flex rounded-2xl bg-white border p-1 dark:bg-slate-950 dark:border-slate-800 shrink-0">
            {(['Engineering', 'Medical', 'Management'] as const).map((domain) => {
              const Icon = domain === 'Engineering' ? Cpu : domain === 'Medical' ? HeartPulse : Briefcase;
              return (
                <button
                  key={domain}
                  onClick={() => setActiveDomain(domain)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeDomain === domain
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{domain}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlights Grid */}
        {loadingColleges ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : topColleges.length === 0 ? (
          <p className="text-sm text-slate-500">No highlights loaded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {topColleges.map((college) => (
              <div
                key={college.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md dark:border-slate-850 dark:bg-slate-950 transition-all duration-300"
              >
                {/* Image header */}
                <div className="relative h-36 bg-slate-100 dark:bg-slate-900">
                  {college.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={college.coverUrl}
                      alt={college.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10" />
                  )}
                  {college.ranking && (
                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      <Award className="h-3 w-3" />
                      <span>NIRF #{college.ranking}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="flex-1 p-5 text-left">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    <Link href={`/colleges/${college.id}`}>{college.name}</Link>
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{college.city}, {college.state}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-900">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Fees</span>
                      <p className="text-xs font-bold text-slate-850 dark:text-white mt-0.5">{formatCurrency(college.fees)}/yr</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Median package</span>
                      <p className="text-xs font-bold text-slate-850 dark:text-white mt-0.5">{college.placementMedian.toFixed(1)} LPA</p>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="flex border-t border-slate-100 p-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
                  <Link
                    href={`/colleges/${college.id}`}
                    className="w-full flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    <span>View Highlights</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Grid Section */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Streamlined Decision Making
          </h2>
          <p className="mt-4 text-sm text-slate-500">
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
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:border-slate-850 dark:bg-slate-950 transition-all duration-300"
              >
                <div>
                  <div className={`inline-flex rounded-2xl p-3 ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
            <p className="mt-4 text-indigo-200 text-sm">
              Input your entrance exam rank (JEE Main, Advanced, NEET, etc.) and category. Our Predictor matches you with historical college seat closing data from standard rounds.
            </p>
            <div className="mt-8">
              <Link
                href="/predictor"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-indigo-900 shadow-sm hover:bg-indigo-50 transition-colors"
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
