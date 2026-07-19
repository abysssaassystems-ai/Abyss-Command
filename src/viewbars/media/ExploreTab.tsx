"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Plus, Film, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ExploreTabProps {
  onAddMedia: (item: any, typeContext: string) => void;
}

export default function ExploreTab({ onAddMedia }: ExploreTabProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
  const [items, setItems] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Surgical configuration tracking matrices
  const [mediaType, setMediaType] = useState('movie');
  const [genre, setGenre] = useState('action');
  const [year, setYear] = useState('');

  const observerTarget = useRef<HTMLDivElement>(null);

  // Securely listen to active software environment cryptographic validations
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
        console.error("EXPLORE_AUTH_HANDSHAKE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Continuous real-time token tracking sync channel
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchExplorationGrid = useCallback(async (targetPage: number, appendMode = false) => {
    if (targetPage === 1) setInitialLoading(true);
    else setScrollLoading(true);

    try {
      const yearParam = year.trim() !== '' ? year.trim() : 'all';
      
      const res = await fetch(`/api/media/explore?type=${mediaType}&genre=${genre}&year=${yearParam}&page=${targetPage}`);
      const data = await res.json();
      const newItems = data.results || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => {
          if (!appendMode) return newItems;
          const combined = [...prev, ...newItems];
          const uniqueIds = new Set();
          return combined.filter((item) => {
            if (uniqueIds.has(item.id)) return false;
            uniqueIds.add(item.id);
            return true;
          });
        });
        setHasMore(true);
      }
    } catch (err) {
      console.error('Explore streaming layer runtime error:', err);
    } finally {
      setInitialLoading(false);
      setScrollLoading(false);
    }
  }, [mediaType, genre, year]);

  // Rehydrate collection matrix upon filter adjustment
  useEffect(() => {
    setPage(1);
    fetchExplorationGrid(1, false);
  }, [mediaType, genre]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchExplorationGrid(1, false);
  };

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || initialLoading || scrollLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchExplorationGrid(nextPage, true);
        }
      },
      { threshold: 0.01, rootMargin: '400px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [page, initialLoading, scrollLoading, hasMore, fetchExplorationGrid]);

  return (
    <div className="w-full space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* 🛠️ HIGH-CONTRAST TARGETED FILTER CONSOLE */}
      <form onSubmit={handleFilterSubmit} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 backdrop-blur-sm flex flex-wrap items-end gap-4 shadow-sm">
        <div className="flex-1 min-w-[150px] space-y-1.5">
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-gray-400 block">Media Category</label>
          <select 
            value={mediaType} 
            disabled={tenantEmail === "unauthenticated_session"}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 outline-none cursor-pointer font-medium transition-all disabled:opacity-40"
          >
            <option value="movie">Movies Only</option>
            <option value="tv">TV Series Only</option>
            <option value="gaming">Video Games</option>
            <option value="books">Books & Literature</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px] space-y-1.5">
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-gray-400 block">Genre Map Specifics</label>
          <select 
            value={genre} 
            disabled={tenantEmail === "unauthenticated_session"}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 outline-none cursor-pointer font-medium transition-all disabled:opacity-40"
          >
            <option value="action">Action / Adventure</option>
            <option value="sci-fi">Sci-Fi / Futuristic</option>
            <option value="drama">Drama</option>
            <option value="fantasy">Fantasy / Magic</option>
            <option value="horror">Horror / Thriller</option>
            <option value="documentary">Documentary / History</option>
            <option value="crime">Crime / Mystery</option>
            <option value="romance">Romance / Soap</option>
            <option value="comedy">Comedy / Humor</option>
            <option value="animation">Animation / Anime</option>
          </select>
        </div>

        <div className="w-24 space-y-1.5">
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-gray-400 block">Release Year</label>
          <input 
            type="text" 
            disabled={tenantEmail === "unauthenticated_session"}
            placeholder={tenantEmail === "unauthenticated_session" ? "Locked" : "e.g. 2026"}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 outline-none text-center font-mono font-bold placeholder-gray-300 transition-all disabled:opacity-40"
          />
        </div>

        <button 
          type="submit" 
          disabled={tenantEmail === "unauthenticated_session"}
          className="p-2.5 bg-gray-900 text-white hover:bg-purple-600 border border-transparent rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Filter className="w-3.5 h-3.5" /> Apply Filter
        </button>
      </form>

      {/* DYNAMIC SCROLL CONTAINER CANVAS */}
      {initialLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <p className="text-xs font-mono font-bold tracking-wider uppercase">Streaming discovery matrix arrays...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400 text-sm font-medium">
          No global registry elements discoverable matching those parameters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, idx) => (
              /* Pixel-Perfect Multi-Color Gradient Wrapper Frame */
              <div 
                key={`${item.id}-${idx}`} 
                className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 aspect-[2/3] flex flex-col justify-end relative overflow-hidden group cursor-pointer"
              >
                {item.poster ? (
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    loading="lazy" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-10" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-4 text-center border-b border-gray-100 text-gray-400">
                    <Film className="w-6 h-6 mb-1 text-gray-300" />
                    <span className="text-[10px] font-black uppercase truncate max-w-full">{item.title}</span>
                  </div>
                )}
                
                {/* High contrast visual linear mask layout */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

                {/* Floating Meta Categories Label */}
                <span className="absolute top-3 left-3 z-30 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-white/90 border border-gray-200 text-purple-600 backdrop-blur-sm shadow-sm">
                  {item.displayType || mediaType}
                </span>

                {/* Overlaid Functional Action Modules */}
                <div className="relative z-20 p-4 space-y-2">
                  <h4 className="font-black text-xs text-gray-900 line-clamp-2 leading-tight drop-shadow-sm text-left">{item.title}</h4>
                  {item.releaseDate && <p className="text-[9px] font-mono font-bold text-gray-400 text-left">{item.releaseDate.split('-')[0]}</p>}
                  
                  <button 
                    type="button"
                    disabled={tenantEmail === "unauthenticated_session"}
                    onClick={() => {
                      if (tenantEmail === "unauthenticated_session") return;
                      onAddMedia(item, item.displayType ? item.displayType.toLowerCase() : mediaType);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 shadow-sm hover:opacity-95 transition-opacity disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                    title={tenantEmail === "unauthenticated_session" ? "Login required to track items" : "Add to library"}
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" /> Add to Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INFINITE SCROLL LOADER MARKER GRID */}
          <div ref={observerTarget} className="w-full pt-8 pb-16 flex items-center justify-center min-h-[50px]">
            {scrollLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Pulling next data rows...
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-gray-400 text-[10px] font-mono font-black uppercase tracking-widest bg-gray-50 px-4 py-2 border border-gray-200 rounded-full shadow-sm">
                — End of Comprehensive Catalog Matrix —
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}