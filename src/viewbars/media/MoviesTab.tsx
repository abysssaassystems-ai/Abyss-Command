"use client";

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Calendar, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface MovieItem {
  id: string;
  title: string;
  poster: string | null;
  release_year?: string;
  status?: string;
}

interface MoviesTabProps {
  movies: MovieItem[];
}

export default function MoviesTab({ movies }: MoviesTabProps): React.JSX.Element {
  const [subTab, setSubTab] = useState<'watchlist' | 'upcoming'>('watchlist');
  const [localMovies, setLocalMovies] = useState<MovieItem[]>(movies);
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
  const [isMutating, setIsMutating] = useState<string | null>(null);

  // Sync real-time workspace stream payloads from parent frame context
  useEffect(() => {
    setLocalMovies(movies);
  }, [movies]);

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Initial signature validation pass
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("MOVIES_AUTH_HANDSHAKE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Real-time auth subscriber channel observer line
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);

  // SECURE CLOUD MUTATION: Updates ledger parameters under multi-tenant constraints
  const handleMarkWatched = async (movieId: string) => {
    if (!isSecuredTenant) return;
    setIsMutating(movieId);

    // Optimistically filter the updated item record out of active workspace view lines
    setLocalMovies(prev => prev.map(m => m.id === movieId ? { ...m, status: 'completed' } : m));

    try {
      const { error } = await supabase
        .from('tracked_movies')
        .update({ status: 'completed' })
        .eq('id', movieId)
        .eq('client_email', tenantEmail); // Strict user permission isolation validation

      if (error) throw error;
    } catch (err) {
      console.error("DATABASE_MUTATION_FAULT:", err);
      // Revert state parameters locally if network pipeline drops out
      setLocalMovies(movies);
    } finally {
      setIsMutating(null);
    }
  };

  // Fallback initial dataset to maintain layout presentation if user row lists are blank
  const displayList = localMovies.length > 0 ? localMovies.filter(movie => {
    const statusVal = movie.status || 'watchlist';
    if (subTab === 'watchlist') return statusVal === 'watchlist';
    return statusVal === 'upcoming';
  }) : (subTab === 'watchlist' ? [
    { id: '1', title: 'The Batman: Part II', poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&auto=format&fit=crop&q=60', status: 'watchlist' },
    { id: '2', title: 'Avengers: Doomsday', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&auto=format&fit=crop&q=60', status: 'watchlist' },
    { id: '3', title: 'Wonder Woman 3', poster: 'https://images.unsplash.com/photo-1608889174637-3c44f6326f1a?w=400&auto=format&fit=crop&q=60', status: 'watchlist' }
  ] : []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* HIGH-CONTRAST SUB-NAV TAB CONTROL BAR */}
      <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
        <button
          type="button"
          disabled={tenantEmail === "authenticating..."}
          onClick={() => setSubTab('watchlist')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            subTab === 'watchlist'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Watch List
        </button>
        <button
          type="button"
          disabled={tenantEmail === "authenticating..."}
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            subTab === 'upcoming'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Upcoming Releases
        </button>
      </div>

      {/* RE-STREAMING DATA WORKSPACE LAYOUT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-400">
          <span>{subTab === 'watchlist' ? 'WATCH NEXT // TERMINAL ACTIVE' : 'UPCOMING THREAT MATRICES'}</span>
          <LayoutGrid className="w-4 h-4 text-blue-500" />
        </div>

        {tenantEmail === "authenticating..." ? (
          <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-gray-400 font-mono text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span>Verifying Secure Handshake Tokens...</span>
          </div>
        ) : displayList.length === 0 ? (
          /* Standby layout view bounds if list query evaluates to empty */
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
            <Calendar className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Index parameters clear</p>
            <p className="text-xs text-gray-400 mt-0.5">No logged tracking entries found for this specific subcategory selection.</p>
          </div>
        ) : (
          /* 3-Column Box-Art Canvas Grid Configuration */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
            {displayList.map((movie) => (
              /* Custom Triple Gradient Outline Frame Wrapper */
              <div
                key={movie.id}
                className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 aspect-[2/3] relative overflow-hidden group flex flex-col justify-end p-4 cursor-pointer bg-white"
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-10"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {movie.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                
                {/* Overlay Action Triggers Content Mask Panels */}
                <div className="relative z-20 space-y-2">
                  <h4 className="font-black text-xs text-gray-900 line-clamp-2 leading-tight text-left">{movie.title}</h4>
                  {movie.release_year && (
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 inline-block">
                        {movie.release_year}
                      </span>
                    </div>
                  )}
                  
                  {subTab === 'watchlist' && (
                    <button 
                      type="button"
                      disabled={isMutating === movie.id || tenantEmail === "unauthenticated_session"}
                      onClick={() => handleMarkWatched(movie.id)}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm hover:opacity-95 focus:outline-none transition-opacity disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                      title={tenantEmail === "unauthenticated_session" ? "Login required to update history" : "Mark as completed"}
                    >
                      {isMutating === movie.id ? (
                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-white stroke-none" /> Mark Watched
                        </>
                      )}
                    </button>
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