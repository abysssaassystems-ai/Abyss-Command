"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Edit2, Grid, Award, List } from 'lucide-react';

export default function MediaOverviewTab(): React.JSX.Element {
  const [profileName, setProfileName] = useState<string>("Authorized Client");

  // Load the authenticated tenant context dynamically from the session layer
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.account_name) {
          setProfileName(parsed.account_name);
        }
      } catch (err) {
        console.error("OVERVIEW_SESSION_PARSE_ERROR:", err);
      }
    }
  }, []);

  // Structural metadata definitions aligned with your tracking records
  const stats = {
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
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn text-gray-800 select-none">
      
      {/* 1. HERO PROFILE BANNER CONTAINER */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 h-44 flex items-end p-6 shadow-sm">
        {/* Subtle corporate background glow parameters */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-transparent to-transparent" />
        
        <div className="relative z-20 flex items-center gap-4 w-full">
          {/* Avatar frame holding letter signatures */}
          <div className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden flex items-center justify-center text-lg font-black text-white shadow-sm">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              {profileName}
              <button type="button" className="p-1 rounded hover:bg-gray-100 transition-colors">
                <Edit2 className="w-3.5 h-3.5 text-gray-400 hover:text-purple-600" />
              </button>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 px-2.5 py-0.5 bg-purple-50 rounded-md border border-purple-100 mt-1 inline-block">
              Ecosystem Profile Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. SOCIAL ENGAGEMENT COUNTERS MATRIX */}
      <div className="grid grid-cols-3 gap-4 border-y border-gray-200 py-5 text-center bg-gray-50/30 rounded-xl px-2">
        <div>
          <div className="text-xl font-mono font-black text-gray-900">{stats.following}</div>
          <div className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mt-0.5">Following</div>
        </div>
        <div className="border-x border-gray-200">
          <div className="text-xl font-mono font-black text-gray-900">{stats.followers}</div>
          <div className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mt-0.5">Followers</div>
        </div>
        <div>
          <div className="text-xl font-mono font-black text-gray-900">{stats.comments}</div>
          <div className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mt-0.5">Comments Matrix</div>
        </div>
      </div>

      {/* 3. CORE ANALYTICS BLOCK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" /> Aggregated System Metrics
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Odometer Card 1: Time Accumulator */}
          <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm">
            <div className="bg-white rounded-[15px] p-5 flex flex-col justify-between h-full min-h-[120px]">
              <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-purple-600" /> Total Duration Index
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <div className="text-2xl font-black text-gray-900 tracking-tight">{stats.tvTime.months}</div>
                  <div className="text-[9px] font-sans font-bold text-gray-400 uppercase mt-0.5">Months</div>
                </div>
                <div className="border-x border-gray-100">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">{stats.tvTime.days}</div>
                  <div className="text-[9px] font-sans font-bold text-gray-400 uppercase mt-0.5">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 tracking-tight">{stats.tvTime.hours}</div>
                  <div className="text-[9px] font-sans font-bold text-gray-400 uppercase mt-0.5">Hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Odometer Card 2: Cumulative Checkpoint Totals */}
          <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm">
            <div className="bg-white rounded-[15px] p-5 flex flex-col justify-between h-full min-h-[120px]">
              <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-blue-500" /> Checkpoints Validated
              </span>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight">
                  {stats.episodesWatched} <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-normal">units</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USER CUSTOM SHELVES LAYOUT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <List className="w-4 h-4 text-purple-600" /> Private Collection Arrays
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLists.map((list) => (
            <div key={list.id} className="group relative rounded-xl overflow-hidden border border-gray-200 h-36 bg-gray-50 cursor-pointer shadow-sm">
              <img src={list.image} alt={list.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-300 group-hover:opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h4 className="font-black text-gray-900 text-sm drop-shadow-sm group-hover:text-purple-600 transition-colors">{list.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CONTINUOUS RUNTIME SYSTEM HOOKS DISPLAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-xs font-mono font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Grid className="w-4 h-4 text-blue-500" /> Active Registry Monitors
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {recentShows.map((show) => (
            <div key={show.id} className="p-[1px] bg-gray-200 hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 rounded-xl transition-all duration-300 shadow-sm group cursor-pointer aspect-[2/3] relative overflow-hidden">
              <div className="w-full h-full rounded-[11px] overflow-hidden bg-white relative flex flex-col justify-end">
                <img src={show.image} alt={show.name} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-20 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white to-transparent pt-8 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <p className="text-[10px] font-black tracking-tight text-gray-900 truncate">{show.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}