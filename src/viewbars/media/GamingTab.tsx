"use client";

import React, { useState, useEffect } from 'react';
import { Gamepad2, LayoutGrid, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface GameItem {
  id: string;
  title: string;
  platform: string;
  hours: number;
  image?: string;
  status: 'backlog' | 'playing';
}

export default function GamingTab(): React.JSX.Element {
  const [subTab, setSubTab] = useState<'backlog' | 'playing'>('backlog');
  const [games, setGames] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");

  // Ingest authenticated session parameters to isolate user rows
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) return;
    
    const email = JSON.parse(session).email;
    setUserEmail(email);
    fetchTenantGames(email);
  }, [subTab]);

  // Read data rows strictly mapped to this client's profile identity
  async function fetchTenantGames(email: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracked_games')
        .select('*')
        .eq('client_email', email)
        .eq('status', subTab)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Map database schema fields safely to UI interface properties
        const formattedGames = data.map((game: any) => ({
          id: game.id,
          title: game.title,
          platform: game.author_or_platform || game.platform || 'PC',
          hours: game.current_progress || game.hours || 0,
          image: game.poster || game.image,
          status: game.status
        }));
        setGames(formattedGames);
      } else {
        // Fallback mock payload to preserve layout visualization if database is empty
        if (subTab === 'backlog') {
          setGames([
            { id: '1', title: 'Elden Ring: Shadow of the Erdtree', platform: 'PC', hours: 42.5, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60', status: 'backlog' },
            { id: '2', title: 'Cyberpunk 2077', platform: 'PS5', hours: 88.0, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60', status: 'backlog' },
            { id: '3', title: 'The Legend of Zelda: Tears of the Kingdom', platform: 'Switch', hours: 124.0, image: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=400&auto=format&fit=crop&q=60', status: 'backlog' },
          ]);
        } else {
          setGames([]);
        }
      }
    } catch (err) {
      console.error("GAMES_FETCH_EXCEPTION:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Secure mutation routine advancing campaign lifecycle row state metrics safely
  const handleToggleCampaignState = async (gameId: string, currentStatus: 'backlog' | 'playing') => {
    if (!userEmail) return;

    const nextStatus = currentStatus === 'backlog' ? 'playing' : 'backlog';

    // Optimistically trim out the updated campaign object row from current view lines
    setGames(prev => prev.filter(g => g.id !== gameId));

    const { error } = await supabase
      .from('tracked_games')
      .update({ status: nextStatus })
      .eq('id', gameId)
      .eq('client_email', userEmail); // Strict tenant safety filter validations

    if (error) {
      console.error("DATABASE_MUTATION_FAULT:", error.message);
      fetchTenantGames(userEmail); // Clear changes locally if transaction breaks
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* HIGH-CONTRAST SUB-NAV TAB CONTROL BAR */}
      <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setSubTab('backlog')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'backlog'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Active Backlog
        </button>
        <button
          type="button"
          onClick={() => setSubTab('playing')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'playing'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Currently Playing
        </button>
      </div>

      {/* RE-STREAMING STATUS INDICATORS */}
      {isLoading ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-gray-400 font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span>Syncing application runtime arrays...</span>
        </div>
      ) : games.length === 0 ? (
        /* Standby state layout for empty tracking slots */
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
          <Gamepad2 className="w-8 h-8 text-gray-300 mb-2 animate-pulse" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">No active campaigns loaded</p>
          <p className="text-xs text-gray-400 mt-0.5">Deploy logs inside your exploration console to track active data.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black tracking-widest text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              {subTab === 'backlog' ? 'Ready to Play' : 'In Progress'}
            </span>
            <LayoutGrid className="w-4 h-4 text-purple-600" />
          </div>

          {/* High Contrast Box-Art Grid Wrapped in Custom Frame Border Layers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {games.map((game) => (
              <div 
                key={game.id}
                className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 aspect-[2/3] relative overflow-hidden group flex flex-col justify-end p-4 cursor-pointer"
              >
                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-10"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-4 text-center text-gray-400 border-b border-gray-100">
                    <Gamepad2 className="w-6 h-6 text-gray-300 mb-1" />
                    <span className="text-[10px] font-black uppercase truncate max-w-full">{game.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                
                {/* Fixed Structural Platform Metadata Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-30">
                  <span className="text-[9px] font-mono font-black uppercase bg-white/90 text-purple-600 px-2 py-0.5 rounded border border-gray-200 backdrop-blur-sm shadow-sm">
                    {game.platform}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 text-gray-500 font-mono text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded border border-gray-200 backdrop-blur-sm shadow-sm z-30">
                  <Clock className="w-3 h-3 text-gray-400" /> {game.hours}h
                </div>
                
                {/* Dynamic Overlay Menu Interfaces */}
                <div className="relative z-20 space-y-2">
                  <h4 className="font-black text-xs text-gray-900 line-clamp-2 leading-tight">{game.title}</h4>
                  <button 
                    type="button"
                    onClick={() => handleToggleCampaignState(game.id, game.status)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm hover:opacity-95 transition-all"
                  >
                    {subTab === 'backlog' ? '🚀 Launch Session' : '📥 Bench Campaign'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}