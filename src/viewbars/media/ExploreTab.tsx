'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Plus, Film, Filter } from 'lucide-react';

interface ExploreTabProps {
  onAddMedia: (item: any, typeContext: string) => void;
}

export default function ExploreTab({ onAddMedia }: ExploreTabProps) {
  const [items, setItems] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Enforcing surgical initial fallback parameters (No ambiguous 'all' defaults)
  const [mediaType, setMediaType] = useState('movie');
  const [genre, setGenre] = useState('action');
  const [year, setYear] = useState('');

  const observerTarget = useRef<HTMLDivElement>(null);

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

  // Trigger grid rehydration instantly on every select change toggle
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
      { threshold: 0.01, rootMargin: '400px' } // Pre-fetches rows smoothly
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [page, initialLoading, scrollLoading, hasMore, fetchExplorationGrid]);

  return (
    <div className="w-full space-y-6 animate-fade-in text-zinc-100">
      
      {/* 🛠️ EXTENDED TARGETED FILTER CONSOLE */}
      <form onSubmit={handleFilterSubmit} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm flex flex-wrap items-end gap-4 shadow-md">
        <div className="flex-1 min-w-[150px] space-y-1.5">
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-zinc-500">Media Category</label>
          <select 
            value={mediaType} 
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 outline-none cursor-pointer"
          >
            <option value="movie">Movies Only</option>
            <option value="tv">TV Series Only</option>
            <option value="gaming">Video Games</option>
            <option value="books">Books & Literature</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px] space-y-1.5">
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-zinc-500">Genre Map Specifics</label>
          <select 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
            className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 outline-none cursor-pointer"
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
          <label className="text-[10px] font-mono font-black tracking-wider uppercase text-zinc-500">Release Year</label>
          <input 
            type="text" 
            placeholder="e.g. 2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 outline-none text-center font-mono placeholder-zinc-600"
          />
        </div>

        <button 
          type="submit" 
          className="p-2 bg-zinc-800 hover:bg-amber-500 hover:text-black border border-zinc-700/60 rounded-lg text-zinc-300 transition-all flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm active:scale-95"
        >
          <Filter className="w-3.5 h-3.5" /> Apply Filter
        </button>
      </form>

      {/* DYNAMIC SCROLL CONTAINER RENDERER */}
      {initialLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-xs font-mono font-bold tracking-wider uppercase">Querying exhaustive catalog pool...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-zinc-800/40 rounded-xl bg-zinc-950/20 text-zinc-500 text-sm">
          No catalog entries match those parameters. Try adjusting the year value.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="group relative bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden aspect-[2/3] flex flex-col justify-end p-4 shadow-lg transform transition-transform"
              >
                {item.poster ? (
                  <img src={item.poster} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-20" />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4 text-center border-b border-zinc-800 text-zinc-600">
                    <Film className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-black uppercase truncate max-w-full">{item.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

                <span className="absolute top-3 left-3 z-30 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800/80 text-amber-400 backdrop-blur-sm">
                  {item.displayType}
                </span>

                <div className="relative z-20 space-y-1.5 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-200">
                  <h4 className="font-extrabold text-xs text-zinc-100 line-clamp-2 drop-shadow-md">{item.title}</h4>
                  {item.releaseDate && <p className="text-[9px] font-mono font-bold text-zinc-500">{item.releaseDate.split('-')[0]}</p>}
                  
                  <button 
                    onClick={() => onAddMedia(item, item.displayType.toLowerCase())}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 transition-colors mt-1 shadow-md"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" /> Add to Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div ref={observerTarget} className="w-full pt-8 pb-16 flex items-center justify-center min-h-[50px]">
            {scrollLoading && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono font-bold uppercase tracking-wider">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Syncing next layout rows...
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-zinc-600 text-[10px] font-mono font-black uppercase tracking-widest bg-zinc-950/40 px-4 py-2 border border-zinc-800/50 rounded-full">
                — End of Extensive Catalog Matrix —
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}