"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import MediaSidebar from '@/components/MediaSidebar';

// Viewbar Sub-tab Component Imports
import MediaOverviewTab from '@/viewbars/media/MediaOverviewTab';
import MoviesTab from '@/viewbars/media/MoviesTab';
import TVShowsTab from '@/viewbars/media/TVShowsTab';
import GamingTab from '@/viewbars/media/GamingTab';
import BooksTab from '@/viewbars/media/BooksTab';
import ExploreTab from '@/viewbars/media/ExploreTab';
import ImportTab from '@/viewbars/media/ImportTab';

type MediaTab = 'overview' | 'movies' | 'tv' | 'gaming' | 'books' | 'import' | 'explore';

export default function MediaDashboardPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<MediaTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // TENANT ISOLATION AND AUTHORIZATION STATES
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [trackedMovies, setTrackedMovies] = useState<any[]>([]);
  const [trackedShows, setTrackedShows] = useState<any[]>([]);

  // Keyboard shortcut: Focuses search instantly
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

  // Clear search targets dynamically
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // 1. NATIVE AUTH AND ACCESS HANDSHAKE ROUTE GUARD
  useEffect(() => {
    async function verifyModuleAccess() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser || !authUser.email) {
          setHasAccess(false);
          return;
        }

        setUser(authUser);

        // Verify module entry token permissions context inside gateway
        const { data, error } = await supabase
          .from('client_module_access')
          .select('is_active')
          .eq('client_email', authUser.email)
          .eq('module_id', 'my-media')
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          setHasAccess(false);
        } else {
          setHasAccess(true);
          // Sync workspace repositories using native identities
          await hydrateTenantWorkspace(authUser.id, authUser.email);
        }
      } catch (err) {
        console.error("MEDIA_SECURITY_HANDSHAKE_EXCEPTION:", err);
        setHasAccess(false);
      }
    }
    
    verifyModuleAccess();
  }, [activeTab]);

  // 2. LIVE DATABASE STREAM RETRIEVAL FOR SPECIFIC LOGGED USER
  async function hydrateTenantWorkspace(userId: string, email: string) {
    try {
      // Robust multi-column lookup fallback to protect custom schemas
      const { data: movies } = await supabase
        .from('tracked_movies')
        .select('*')
        .or(`user_id.eq.${userId},client_email.eq.${email}`)
        .order('created_at', { ascending: false });

      const { data: shows } = await supabase
        .from('tracked_shows')
        .select('*')
        .or(`user_id.eq.${userId},client_email.eq.${email}`)
        .order('created_at', { ascending: false });

      if (movies) setTrackedMovies(movies);
      if (shows) setTrackedShows(shows);
    } catch (err) {
      console.error("DATA_HYDRATION_FAULT:", err);
    }
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let searchType = 'movie';
    if (activeTab === 'movies') searchType = 'movie';
    if (activeTab === 'tv') searchType = 'tv';
    if (activeTab === 'gaming') searchType = 'gaming';
    if (activeTab === 'books') searchType = 'books';

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

  // 3. SECURE ASSET WRITING CONTEXT WITH DUAL BINDING
  const handleAddMedia = async (item: any, forcedType?: string) => {
    if (!user) return;

    const resolvedContext = forcedType || activeTab;
    const isMovie = resolvedContext === 'movies' || resolvedContext === 'movie';
    const targetTable = isMovie ? 'tracked_movies' : 'tracked_shows';

    try {
      // Build normalized payload mapping your schema definitions
      const insertPayload = {
        user_id: user.id,              // Secure native UUID target
        client_email: user.email,      // Legacy backward-compatibility string
        title: item.title,
        poster: item.poster,
        release_year: item.releaseDate ? item.releaseDate.split('-')[0] : 'Unknown',
        ...(isMovie ? {} : { 
          episode_code: 'S01 | E01', 
          episode_title: 'Added via workspace terminal feed' 
        })
      };

      const { error } = await supabase
        .from(targetTable)
        .insert([insertPayload]);

      if (error) {
        alert(`PERSISTENCE_FAULT: ${error.message}`);
        return;
      }

      alert(`"${item.title}" successfully committed to your secure database container.`);
      setSearchQuery('');
      hydrateTenantWorkspace(user.id, user.email);

    } catch (dbError) {
      console.error('Programmatic mutation fault boundary exception:', dbError);
    }
  };

  // 4. EMBED BILLING WALL TO PREVENT ACCESS TO UNPAID CLIENTS
  if (hasAccess === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white select-none">
        <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-3xl shadow-xl max-w-md w-full">
          <div className="bg-white rounded-[23px] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto border border-purple-100 text-purple-600 font-bold">🔒</div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Module License Locked</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your organization has not deployed the Media Management Module infrastructure yet. You can unlock and purchase access directly from your account marketplace catalogue.
            </p>
            <Link href="/dashboard/app-catalogue" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:opacity-95">
              Unlock Terminal Core ($9.99/mo)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading boundary while database validates session signatures
  if (hasAccess === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-gray-400 uppercase tracking-widest animate-pulse bg-white select-none">
        Syncing workspace security keys...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-gray-800 font-sans selection:bg-purple-100 select-none">
      
      {/* Sidebar Subnavigation */}
      <MediaSidebar activeTab={activeTab as any} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        
        {/* GLOBAL CONTEXT SEARCH STRIP HEADER */}
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search indexed arrays... (Press '/' to focus)`}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
            />
          </form>

          {/* User Meta Tracking Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:block">
              <p className="text-xs font-black text-gray-900">{user?.user_metadata?.account_name || "Authorized Client"}</p>
              <p className="text-[9px] font-mono text-purple-600 font-bold tracking-wider uppercase">Secure Enclave Active</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-gray-400 flex items-center justify-center font-black text-white text-xs shadow-md">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* ACTIVE WORKSPACE CANVAS MODULE */}
        <main className="flex-1 p-6 md:p-8 bg-white">
          
          {isSearching && (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-xs font-mono font-bold tracking-wider uppercase">Streaming indexing cluster arrays...</p>
            </div>
          )}

          {!isSearching && searchQuery.trim() !== '' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-black tracking-tight text-gray-900">
                  Search Results for <span className="text-purple-600">"{searchQuery}"</span>
                </h2>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider"
                >
                  Clear Result Matrix
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 rounded-2xl bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-500">No matching index registries discovered.</p>
                  <p className="text-xs text-gray-400 mt-1">Adjust query specifications or filter arrays and try again.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all aspect-[2/3] flex flex-col justify-end p-4 relative overflow-hidden group cursor-pointer"
                    >
                      {item.poster && (
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:opacity-10 transition-opacity" 
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

                      <div className="relative z-20 space-y-1.5 opacity-100 transition-opacity duration-200">
                        <h4 className="font-black text-xs text-gray-900 line-clamp-2">{item.title}</h4>
                        {item.releaseDate && <p className="text-[9px] font-mono font-bold text-gray-400">{item.releaseDate.split('-')[0]}</p>}
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAddMedia(item); }}
                          className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 shadow-sm hover:opacity-95"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" /> Add to Tracker
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isSearching && searchQuery.trim() === '' && (
            <div className="w-full h-full">
              {activeTab === 'overview' && <MediaOverviewTab />}
              
              {activeTab === 'explore' && (
                <ExploreTab onAddMedia={(item, typeContext) => handleAddMedia(item, typeContext)} />
              )}
              
              {activeTab === 'movies' && (
                <MoviesTab movies={trackedMovies} />
              )}
              
              {activeTab === 'tv' && (
                <TVShowsTab shows={trackedShows} />
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