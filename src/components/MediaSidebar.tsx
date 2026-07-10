'use client';

import React from 'react';
import { Film, Tv, Gamepad2, BookOpen, Settings, UploadCloud, Search } from 'lucide-react';

type MediaTab = 'overview' | 'movies' | 'tv' | 'gaming' | 'books' | 'import' | 'explore';

interface MediaSidebarProps {
  activeTab: MediaTab;
  setActiveTab: (tab: MediaTab) => void;
}

export default function MediaSidebar({ activeTab, setActiveTab }: MediaSidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Settings }, // Acts as Account/Dashboard overview
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Search },
  ] as const;

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col justify-between p-4 text-zinc-200">
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3">
            My Media Catalog
          </h2>
        </div>

        {/* Core Media Type Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-black shadow-md font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Premium Migration CTA Option */}
      <div className="mt-auto pt-4 border-t border-zinc-900">
        <button
          onClick={() => setActiveTab('import')}
          className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
            activeTab === 'import'
              ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
              : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          TV Time Migration
        </button>
      </div>
    </aside>
  );
}