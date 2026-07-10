'use client';

import React, { useState } from 'react';
import { LayoutGrid, Calendar, Play } from 'lucide-react';

interface MovieItem {
  id: string;
  title: string;
  poster: string | null;
  releaseDate?: string;
}

interface MoviesTabProps {
  movies?: MovieItem[];
}

export default function MoviesTab({ movies }: MoviesTabProps) {
  const [subTab, setSubTab] = useState<'watchlist' | 'upcoming'>('watchlist');

  // Fallback initial layout list matching your baseline selections
  const defaultWatchlist = [
    { id: '1', title: 'The Batman: Part II', poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&auto=format&fit=crop&q=60' },
    { id: '2', title: 'Avengers: Doomsday', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&auto=format&fit=crop&q=60' },
    { id: '3', title: 'Wonder Woman 3', poster: 'https://images.unsplash.com/photo-1608889174637-3c44f6326f1a?w=400&auto=format&fit=crop&q=60' },
    { id: '4', title: 'Avatar: Fire and Ash', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60' },
    { id: '5', title: 'Now You See Me 3', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=60' },
    { id: '6', title: 'Freakier Friday', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=60' },
  ];

  const activeWatchlist = movies || defaultWatchlist;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* WATCH LIST / UPCOMING TOGGLE SUB-NAV */}
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xxs font-black tracking-widest text-zinc-500 uppercase bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
              Watch Next
            </span>
            <LayoutGrid className="w-4 h-4 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {activeWatchlist.map((movie) => (
              <div
                key={movie.id}
                className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer shadow-lg"
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-40"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center p-4 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">{movie.title}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <h4 className="font-extrabold text-sm text-zinc-100 mb-2 truncate">{movie.title}</h4>
                  <button className="w-full py-2 bg-amber-500 text-black rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-amber-400 shadow-md">
                    <Play className="w-3.5 h-3.5 fill-black" /> Mark Watched
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Calendar className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-400">No upcoming theater dates logged</p>
          <p className="text-xs text-zinc-600 mt-1">Movies in your watchlist will appear here as release dates approach.</p>
        </div>
      )}

    </div>
  );
}