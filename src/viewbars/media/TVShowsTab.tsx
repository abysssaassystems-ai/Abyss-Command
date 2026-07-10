'use client';

import React, { useState } from 'react';
import { CheckCircle2, Tv } from 'lucide-react';

interface TVShowItem {
  id: string;
  title: string;
  poster: string | null;
  episodeCode?: string;
  episodeTitle?: string;
  isPremiere?: boolean;
  isNew?: boolean;
}

interface TVShowsTabProps {
  shows?: TVShowItem[];
}

export default function TVShowsTab({ shows }: TVShowsTabProps) {
  const [subTab, setSubTab] = useState<'watchlist' | 'upcoming'>('watchlist');

  const defaultShows = [
    {
      id: '1',
      title: 'The 100 Girlfriends Who Really, Really, Really, Really, Really Love You',
      episodeCode: 'S03 | E01',
      episodeTitle: 'No title yet',
      isPremiere: true,
      isNew: true,
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=60',
    },
    {
      id: '2',
      title: 'Mushoku Tensei: Jobless Reincarnation',
      episodeCode: 'S03 | E01 +1',
      episodeTitle: 'Burn Bright, Mad Dog',
      isPremiere: true,
      isNew: true,
      poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=60',
    },
    {
      id: '3',
      title: "X-Men '97",
      episodeCode: 'S02 | E01 +2',
      episodeTitle: 'Days of Past Future',
      isPremiere: true,
      isNew: true,
      poster: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=300&auto=format&fit=crop&q=60',
    },
  ];

  const activeShows = shows || defaultShows;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setSubTab('watchlist')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'watchlist'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Watch List
        </button>
        <button
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'upcoming'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Upcoming
        </button>
      </div>

      {subTab === 'watchlist' ? (
        <div className="space-y-3">
          {activeShows.map((show) => (
            <div
              key={show.id}
              className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700/60 transition-colors group"
            >
              <div className="w-16 h-22 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                {show.poster ? (
                  <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-2 text-center text-[10px] text-zinc-600 font-black uppercase">No Art</div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                    {show.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono font-bold">
                  <span>{show.episodeCode || 'S01 | E01'}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-300 font-sans font-medium truncate">{show.episodeTitle || 'Unreleased / Logged Entry'}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  {show.isPremiere && (
                    <span className="text-[9px] font-black uppercase bg-black text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 tracking-wider">
                      Premiere
                    </span>
                  )}
                  {show.isNew && (
                    <span className="text-[9px] font-black uppercase bg-amber-500 text-black px-2 py-0.5 rounded tracking-wider">
                      New
                    </span>
                  )}
                </div>
              </div>

              <button className="p-2 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-amber-500/10 hover:border-amber-500/40 text-zinc-600 hover:text-amber-400 transition-all flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Tv className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-400">No series air dates scheduled today</p>
          <p className="text-xs text-zinc-600 mt-1">New episodes will drop into an active schedule feed here.</p>
        </div>
      )}

    </div>
  );
}