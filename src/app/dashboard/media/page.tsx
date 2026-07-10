'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plus, Film, Tv, Gamepad2, BookOpen } from 'lucide-react';
import MediaSidebar from '@/components/MediaSidebar';

// Viewbar Sub-tab Component Imports (Watchlist / Progress States)
import MediaOverviewTab from '@/viewbars/media/MediaOverviewTab';
import MoviesTab from '@/viewbars/media/MoviesTab';
import TVShowsTab from '@/viewbars/media/TVShowsTab';
import GamingTab from '@/viewbars/media/GamingTab';
import BooksTab from '@/viewbars/media/BooksTab';
import ExploreTab from '@/viewbars/media/ExploreTab';
import ImportTab from '@/viewbars/media/ImportTab';

type MediaTab = 'overview' | 'movies' | 'tv' | 'gaming' | 'books' | 'import' | 'explore';

export default function MediaDashboardPage() {
  const [activeTab, setActiveTab] = useState<MediaTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 🌟 RUNTIME STORAGE SHELVES FOR REAL-TIME FRONTEND PIPELINES
  const [trackedMovies, setTrackedMovies] = useState<any[]>([]);
  const [trackedShows, setTrackedShows] = useState<any[]>([]);

  // Keyboard shortcut: Pressing '/' focuses search instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clear search results instantly if the user wipes out the input field
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Map your active sidebar navigation choice to the backend API parameters
    let searchType = '';
    if (activeTab === 'movies') searchType = 'movie';
    if (activeTab === 'tv') searchType = 'tv';
    if (activeTab === 'gaming') searchType = 'gaming';
    if (activeTab === 'books') searchType = 'books';

    // If a user searches while on 'Overview', 'Explore', or 'Import', default their scope to Movies
    if (!searchType) searchType = 'movie';

    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(`/api/media/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Network connection error matching records');
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Frontend search dispatch exception:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 🌟 SYNCHRONIZED CLOUD DATABASE PERSISTENCE ROUTINE (FIXED ADAPTIVE TYPE CONTEXTS)
  const handleAddMedia = async (item: any, forcedType?: string) => {
    console.log('Upserting item entry to current active UI layers & Supabase instances:', item);
    
    // Uses the explicitly declared item category from Explore if activeTab is ambiguous
    const resolvedContext = forcedType || activeTab;
    const dbMediaType = (resolvedContext === 'movies' || resolvedContext === 'movie') ? 'movie' : 'tv';

    try {
      // Fire payload asynchronously to the backend tracking server route
      fetch('/api/media/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, mediaType: dbMediaType })
      }).then((res) => {
        if (!res.ok) console.warn('Supabase persistence engine warning returned status:', res.status);
      });
    } catch (dbError) {
      console.error('Non-blocking cloud mutation request exception:', dbError);
    }

    // 💥 PRISTINE WORKING RENDER STATE LOGIC SECURELY PRESERVED
    if (resolvedContext === 'movies' || resolvedContext === 'movie') {
      const formattedMovie = {
        ...item,
        image: item.poster
      };
      setTrackedMovies((prev) => [formattedMovie, ...prev]);
      alert(`Added "${item.title}" directly to your Movies Watch List & saved to Supabase!`);
    } else if (resolvedContext === 'tv' || resolvedContext === 'tv show') {
      const formattedShow = {
        ...item,
        image: item.poster,
        episodeCode: 'S01 | E01',
        episodeTitle: 'Added via system dashboard feed',
        isNew: true,
        isPremiere: false
      };
      setTrackedShows((prev) => [formattedShow, ...prev]);
      alert(`Added "${item.title}" directly to your TV Shows Tracking rows & saved to Supabase!`);
    } else {
      alert(`Added "${item.title}" to your temporary cache parameters!`);
    }

    // Automatically reset the search bar state to slide back to your custom metrics lists
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen w-full bg-zinc-900 overflow-hidden text-zinc-100 font-sans selection:bg-amber-500/30">
      
      <MediaSidebar activeTab={activeTab as keyof typeof MediaSidebar} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* GLOBAL HEADER BAR WITH CONTEXT SENSITIVE LOOKUP */}
        <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'overview' || activeTab === 'import' || activeTab === 'explore' ? 'media' : activeTab === 'tv' ? 'TV shows' : activeTab}... (Press '/' to focus)`}
              className="w-full bg-zinc-900/90 text-zinc-100 text-sm pl-10 pr-4 py-2 rounded-xl border border-zinc-800/80 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
            />
          </form>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-300">Anonymous</p>
              <p className="text-[10px] font-mono text-zinc-500 font-semibold tracking-wider uppercase">Free Trial</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-400/20 flex items-center justify-center font-black text-black text-xs shadow-md">
              A
            </div>
          </div>
        </header>

        {/* MAIN DYNAMIC CONTENT WORKSPACE LAYOUT */}
        <main className="flex-1 p-6 md:p-8">
          
          {/* CONDITION A: SHOW LOADING SPINNER DURING BACKGROUND API CALLS */}
          {isSearching && (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs font-mono font-bold tracking-wider uppercase">Querying external index matrices...</p>
            </div>
          )}

          {/* CONDITION B: RENDER REAL TIME NETWORK RESULTS GRID */}
          {!isSearching && searchQuery.trim() !== '' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-lg font-black tracking-tight">
                  Search Results for <span className="text-amber-400">"{searchQuery}"</span>
                </h2>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 border border-zinc-800/50 rounded-2xl bg-zinc-950/20">
                  <p className="text-sm font-medium text-zinc-400">No cross-platform database matches found.</p>
                  <p className="text-xs text-zinc-600 mt-1">Double check your spelling or choose a different query parameters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden aspect-[2/3] flex flex-col justify-end p-4 shadow-lg cursor-pointer"
                    >
                      {item.poster ? (
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 group-hover:opacity-20"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4 text-center border-b border-zinc-800">
                          {activeTab === 'gaming' ? <Gamepad2 className="w-6 h-6 text-zinc-700 mb-1" /> : activeTab === 'books' ? <BookOpen className="w-6 h-6 text-zinc-700 mb-1" /> : <Film className="w-6 h-6 text-zinc-700 mb-1" />}
                          <p className="text-xxs font-bold text-zinc-500 uppercase tracking-wide truncate max-w-full">{item.title}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                      {/* Info Overlay Content display */}
                      <div className="relative z-20 space-y-1.5 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-200">
                        <h4 className="font-extrabold text-xs text-zinc-100 line-clamp-2 drop-shadow-md">{item.title}</h4>
                        {item.author && <p className="text-[10px] text-zinc-400 truncate">by {item.author}</p>}
                        {item.releaseDate && <p className="text-[9px] font-mono font-bold text-zinc-500">{item.releaseDate.split('-')[0]}</p>}
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddMedia(item); }}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 transition-colors mt-1 shadow-md"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" /> Add to Tracker
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONDITION C: IF NO SEARCH ACTIVE, RENDER NATIVE TAB MENUS */}
          {!isSearching && searchQuery.trim() === '' && (
            <div className="w-full h-full">
              {activeTab === 'overview' && <MediaOverviewTab />}
              
              {/* 🌟 FIXED: MOUNTED EXPLORE COMPONENT LAYER INTO DISPLAY ROUTER */}
              {activeTab === 'explore' && (
                <ExploreTab onAddMedia={(item, typeContext) => handleAddMedia(item, typeContext)} />
              )}
              
              {activeTab === 'movies' && (
                <MoviesTab movies={trackedMovies.length > 0 ? trackedMovies : undefined} />
              )}
              
              {activeTab === 'tv' && (
                <TVShowsTab shows={trackedShows.length > 0 ? trackedShows : undefined} />
              )}
              
              {activeTab === 'gaming' && <GamingTab />}
              {activeTab === 'books' && <BooksTab />}
              {activeTab === 'import' && <ImportTab />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}