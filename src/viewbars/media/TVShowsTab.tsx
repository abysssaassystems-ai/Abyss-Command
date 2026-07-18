"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Tv, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface TVShowItem {
  id: string;
  title: string;
  poster: string | null;
  episode_code?: string;
  episode_title?: string;
  is_premiere?: boolean;
  is_new?: boolean;
  status?: string;
}

interface TVShowsTabProps {
  shows?: TVShowItem[];
}

export default function TVShowsTab({ shows }: TVShowsTabProps): React.JSX.Element {
  const [subTab, setSubTab] = useState<'watchlist' | 'upcoming'>('watchlist');
  const [localShows, setLocalShows] = useState<TVShowItem[]>(shows || []);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMutating, setIsMutating] = useState<string | null>(null);

  // Synchronize incoming cloud streams with local workspace views
  useEffect(() => {
    if (shows) {
      setLocalShows(shows);
    }
    const session = localStorage.getItem("active_software_user");
    if (session) {
      setUserEmail(JSON.parse(session).email);
    }
  }, [shows]);

  // SECURE CLOUD MUTATION: Updates ledger progress indicators mapped to user signatures
  const handleMarkEpisodeWatched = async (showId: string) => {
    if (!userEmail) return;
    setIsMutating(showId);

    // Optimistically toggle completion states inside the viewport
    setLocalShows(prev => prev.map(s => s.id === showId ? { ...s, status: 'completed' } : s));

    try {
      const { error } = await supabase
        .from('tracked_shows')
        .update({ status: 'completed' })
        .eq('id', showId)
        .eq('client_email', userEmail); // Strict multi-tenant row verification boundary

      if (error) throw error;
    } catch (err) {
      console.error("DATABASE_MUTATION_FAULT:", err);
      if (shows) setLocalShows(shows); // Rollback state parameters safely if pipeline breaks
    } finally {
      setIsMutating(null);
    }
  };

  // Fallback structural datasets to maintain presentation layers if initial streams are clean/empty
  const activeShows = localShows.length > 0 ? localShows.filter(show => {
    const statusVal = show.status || 'watchlist';
    return subTab === 'watchlist' ? statusVal === 'watchlist' : statusVal === 'completed';
  }) : (subTab === 'watchlist' ? [
    {
      id: '1',
      title: 'The 100 Girlfriends Who Really, Really, Really, Really, Really Love You',
      episode_code: 'S03 | E01',
      episode_title: 'No title yet',
      is_premiere: true,
      is_new: true,
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=60',
      status: 'watchlist'
    },
    {
      id: '2',
      title: 'Mushoku Tensei: Jobless Reincarnation',
      episode_code: 'S03 | E01 +1',
      episode_title: 'Burn Bright, Mad Dog',
      is_premiere: true,
      is_new: true,
      poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=60',
      status: 'watchlist'
    },
    {
      id: '3',
      title: "X-Men '97",
      episode_code: 'S02 | E01 +2',
      episode_title: 'Days of Past Future',
      is_premiere: true,
      is_new: true,
      poster: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=300&auto=format&fit=crop&q=60',
      status: 'watchlist'
    },
  ] : []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* HIGH-CONTRAST CORPORATE SUB-NAV TOGGLES */}
      <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setSubTab('watchlist')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'watchlist'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Active Series
        </button>
        <button
          type="button"
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'upcoming'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Completed Archive
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-400">
          <span>{subTab === 'watchlist' ? 'STREAMING FEED // TERMINAL MONITOR' : 'ARCHIVAL CHECKPOINTS'}</span>
          <Tv className="w-4 h-4 text-blue-500" />
        </div>

        {activeShows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
            <Calendar className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Index parameters clear</p>
            <p className="text-xs text-gray-400 mt-0.5">No logged tracking entries found inside this specific column partition.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeShows.map((show) => (
              /* Custom High-Contrast Triple Layer Gradient Outline Frame Wrapper */
              <div
                key={show.id}
                className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="bg-white rounded-[15px] p-4 flex items-center gap-4 relative overflow-hidden">
                  
                  {/* Series Art Thumbnail Display Box */}
                  <div className="w-16 h-22 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-inner">
                    {show.poster ? (
                      <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2 text-center text-[9px] text-gray-400 font-bold uppercase">No Art</div>
                    )}
                  </div>

                  {/* Metadata Descriptive Text Cluster */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h4 className="font-black text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {show.title}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono font-bold">
                      <span className="text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md text-[10px]">
                        {show.episode_code || show.episode_code || 'S01 | E01'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 font-sans font-medium truncate">
                        {show.episode_title || show.episode_title || 'Logged Entry Core Matrix'}
                      </span>
                    </div>

                    {/* Condition Status Badge Row */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {(show.is_premiere || show.is_premiere) && (
                        <span className="text-[9px] font-black uppercase bg-gray-900 text-white px-2 py-0.5 rounded-md tracking-wider">
                          Premiere
                        </span>
                      )}
                      {(show.is_new || show.is_new) && (
                        <span className="text-[9px] font-black uppercase bg-blue-100 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md tracking-wider">
                          New Episode
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Mutator Selection Module */}
                  {subTab === 'watchlist' ? (
                    <button 
                      type="button"
                      disabled={isMutating === show.id}
                      onClick={() => handleMarkEpisodeWatched(show.id)}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all flex-shrink-0 shadow-sm focus:outline-none cursor-pointer"
                    >
                      {isMutating === show.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                      )}
                    </button>
                  ) : (
                    <div className="p-3 text-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}