'use client';

import React from 'react';
import { ChevronRight, Edit2, Grid, Award, List } from 'lucide-react';

export default function MediaOverviewTab() {
  // Mock data matching your exact TV Time profile screenshot metrics
  const stats = {
    username: 'Anonymous',
    following: 0,
    followers: 0,
    comments: 0,
    tvTime: { months: 27, days: 20, hours: 21 },
    episodesWatched: '38,461',
  };

  const topLists = [
    {
      id: '1',
      title: 'Top 50 Live Action Shows',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60',
    },
  ];

  const recentShows = [
    { id: '1', name: 'Squid Game', image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=300&auto=format&fit=crop&q=60' },
    { id: '2', name: 'Ginny & Georgia', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&auto=format&fit=crop&q=60' },
    { id: '3', name: 'Ironheart', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* 1. HERO PROFILE BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 h-48 flex items-end p-6">
        {/* Deep background glow matching the dark Iron Throne graphic mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        
        <div className="relative z-20 flex items-center gap-4 w-full">
          <div className="w-20 h-20 rounded-full border-2 border-zinc-700 bg-zinc-800 overflow-hidden flex items-center justify-center text-xl font-bold text-zinc-400">
            ?
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              {stats.username}
              <button className="p-1 rounded hover:bg-zinc-900 transition-colors">
                <Edit2 className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
              </button>
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/20 mt-1 inline-block">
              Edit Profile
            </span>
          </div>
        </div>
      </div>

      {/* 2. SOCIAL ENGAGEMENT COUNTERS */}
      <div className="grid grid-cols-3 gap-4 border-y border-zinc-800/60 py-4 text-center">
        <div>
          <div className="text-lg font-extrabold text-zinc-100">{stats.following}</div>
          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-0.5">following</div>
        </div>
        <div className="border-x border-zinc-800/60">
          <div className="text-lg font-extrabold text-zinc-100">{stats.followers}</div>
          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-0.5">followers</div>
        </div>
        <div>
          <div className="text-lg font-extrabold text-zinc-100">{stats.comments}</div>
          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-0.5">comments</div>
        </div>
      </div>

      {/* 3. CORE ANALYTICS BLOCK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Stats
          </h3>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Odometer Card 1: TV Time accumulator */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" /> TV Time
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-black text-zinc-100">{stats.tvTime.months}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-1">Months</div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-100">{stats.tvTime.days}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-1">Days</div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-100">{stats.tvTime.hours}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-1">Hours</div>
              </div>
            </div>
          </div>

          {/* Odometer Card 2: Cumulative total episodes */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" /> Episodes Watched
            </span>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-4xl font-black text-zinc-100 tracking-tight">
                {stats.episodesWatched}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USER LIST SHELF */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <List className="w-4 h-4 text-amber-500" /> Lists
          </h3>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLists.map((list) => (
            <div key={list.id} className="group relative rounded-xl overflow-hidden border border-zinc-800 h-36 bg-zinc-950 cursor-pointer">
              <img src={list.image} alt={list.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h4 className="font-bold text-zinc-100 text-sm drop-shadow-sm">{list.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CONTINUOUS SHOWS WATCHING GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Grid className="w-4 h-4 text-amber-500" /> Active Shows
          </h3>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {recentShows.map((show) => (
            <div key={show.id} className="aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 relative group cursor-pointer">
              <img src={show.image} alt={show.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] font-bold truncate text-zinc-200">{show.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}