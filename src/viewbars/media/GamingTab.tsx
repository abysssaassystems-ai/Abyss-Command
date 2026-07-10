'use client';

import React, { useState } from 'react';
import { Gamepad2, LayoutGrid, Clock } from 'lucide-react';

export default function GamingTab() {
  const [subTab, setSubTab] = useState<'backlog' | 'playing'>('backlog');

  const backlogGames = [
    { id: '1', title: 'Elden Ring: Shadow of the Erdtree', platform: 'PC', hours: '42.5', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60' },
    { id: '2', title: 'Cyberpunk 2077', platform: 'PS5', hours: '88.0', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60' },
    { id: '3', title: 'The Legend of Zelda: Tears of the Kingdom', platform: 'Switch', hours: '124.0', image: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=400&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* SUB-NAV TOGGLES */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setSubTab('backlog')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'backlog'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Active Backlog
        </button>
        <button
          onClick={() => setSubTab('playing')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'playing'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Currently Playing
        </button>
      </div>

      {subTab === 'backlog' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xxs font-black tracking-widest text-zinc-500 uppercase bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
              Ready to Play
            </span>
            <LayoutGrid className="w-4 h-4 text-amber-500" />
          </div>

          {/* 3-Column Box-Art Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {backlogGames.map((game) => (
              <div
                key={game.id}
                className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer shadow-lg"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                
                {/* Fixed Metadata Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className="text-[10px] font-mono font-black uppercase bg-zinc-900/90 text-amber-400 px-2 py-0.5 rounded border border-zinc-700/50 backdrop-blur-sm">
                    {game.platform}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-zinc-400 font-mono text-[11px] bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-sm z-10">
                  <Clock className="w-3 h-3 text-zinc-500" /> {game.hours}h
                </div>
                
                {/* Dynamic Content Action Cover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <h4 className="font-extrabold text-sm text-zinc-100 mb-2 truncate">{game.title}</h4>
                  <button className="w-full py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors shadow-md">
                    Update Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Gamepad2 className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-400">No active campaigns loaded</p>
          <p className="text-xs text-zinc-600 mt-1">Move games to 'Currently Playing' to track real-time session logs.</p>
        </div>
      )}

    </div>
  );
}