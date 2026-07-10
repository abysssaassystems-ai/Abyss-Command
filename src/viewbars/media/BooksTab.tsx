'use client';

import React, { useState } from 'react';
import { BookOpen, BookmarkCheck } from 'lucide-react';

export default function BooksTab() {
  const [subTab, setSubTab] = useState<'reading' | 'completed'>('reading');

  const readingList = [
    { id: '1', title: 'Dune', author: 'Frank Herbert', currentPage: 340, totalPages: 600, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&auto=format&fit=crop&q=60' },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', currentPage: 110, totalPages: 320, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=60' },
    { id: '3', title: 'Project Hail Mary', author: 'Andy Weir', currentPage: 450, totalPages: 476, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* SUB-NAV TOGGLES */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setSubTab('reading')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'reading'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Reading List
        </button>
        <button
          onClick={() => setSubTab('completed')}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            subTab === 'completed'
              ? 'border-amber-500 text-zinc-100 font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Completed
        </button>
      </div>

      {subTab === 'reading' ? (
        <div className="space-y-3">
          {readingList.map((book) => {
            const progressPercent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
            
            return (
              <div
                key={book.id}
                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700/60 transition-colors group"
              >
                {/* Book Jacket Thumbnail */}
                <div className="w-14 h-20 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                </div>

                {/* Progress Details Layout */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">by {book.author}</p>
                  </div>
                  
                  {/* Inline Metrics Progress Slider bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 border border-zinc-800 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold text-zinc-500">
                      <span>{book.currentPage} / {book.totalPages} pages</span>
                      <span className="text-zinc-400">{progressPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Status Quick-action Log Anchor */}
                <button className="p-2 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-amber-500/10 hover:border-amber-500/40 text-zinc-600 hover:text-amber-400 transition-all flex-shrink-0">
                  <BookmarkCheck className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <BookOpen className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-400">Library shelves empty</p>
          <p className="text-xs text-zinc-600 mt-1">Finished books will stack up right here.</p>
        </div>
      )}

    </div>
  );
}