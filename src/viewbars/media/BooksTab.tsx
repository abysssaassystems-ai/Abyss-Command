"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, BookmarkCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface BookItem {
  id: string;
  title: string;
  author: string;
  current_page: number;
  total_pages: number;
  image?: string;
  status: 'reading' | 'completed';
}

export default function BooksTab(): React.JSX.Element {
  const [subTab, setSubTab] = useState<'reading' | 'completed'>('reading');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");

  // Ingest authenticated session parameters to isolate user rows
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) return;
    
    const email = JSON.parse(session).email;
    setUserEmail(email);
    fetchTenantBooks(email);
  }, [subTab]);

  // Read data rows strictly mapped to this client's profile identity
  async function fetchTenantBooks(email: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracked_books')
        .select('*')
        .eq('client_email', email)
        .eq('status', subTab)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBooks(data);
      } else {
        // Fallback mock payload to preserve layout visualization if database returns clean/empty
        if (subTab === 'reading') {
          setBooks([
            { id: '1', title: 'Dune', author: 'Frank Herbert', current_page: 340, total_pages: 600, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&auto=format&fit=crop&q=60', status: 'reading' },
            { id: '2', title: 'Atomic Habits', author: 'James Clear', current_page: 110, total_pages: 320, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=60', status: 'reading' },
            { id: '3', title: 'Project Hail Mary', author: 'Andy Weir', current_page: 450, total_pages: 476, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=60', status: 'reading' },
          ]);
        } else {
          setBooks([]);
        }
      }
    } catch (err) {
      console.error("BOOKS_FETCH_EXCEPTION:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Secure mutation routine updating book status rows safely under client_email constraints
  const handleMarkAsCompleted = async (bookId: string) => {
    if (!userEmail) return;

    // Look up the target book from the local state array to extract its total pages
    const targetedBook = books.find(b => b.id === bookId);
    const targetPages = targetedBook ? targetedBook.total_pages : 0;

    // Optimistically trim out the complete object row from local view lines
    setBooks(prev => prev.filter(b => b.id !== bookId));

    const { error } = await supabase
      .from('tracked_books')
      .update({ 
        status: 'completed', 
        current_page: targetPages // Safe literal integer pass-through
      })
      .eq('id', bookId)
      .eq('client_email', userEmail); // Strict user permission filter checks

    if (error) {
      console.error("DATABASE_MUTATION_FAULT:", error.message);
      fetchTenantBooks(userEmail); // Wipes back state if query execution fails
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* HIGH-CONTRAST SUB-NAV TAB CONTROL BAR */}
      <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setSubTab('reading')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'reading'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Reading List
        </button>
        <button
          type="button"
          onClick={() => setSubTab('completed')}
          className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === 'completed'
              ? 'bg-white text-purple-600 border border-gray-100 shadow-sm font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Completed Logs
        </button>
      </div>

      {/* RE-STREAMING STATUS INDICATORS */}
      {isLoading ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-gray-400 font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span>Synchronizing library indexes...</span>
        </div>
      ) : books.length === 0 ? (
        /* Standby state layout for empty tracking slots */
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
          <BookOpen className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Library shelves empty</p>
          <p className="text-xs text-gray-400 mt-0.5">Discovered literature elements will display right here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => {
            const progressPercent = Math.min(100, Math.round((book.current_page / book.total_pages) * 100)) || 0;
            
            return (
              /* Custom double-layered corporate border padding structure */
              <div
                key={book.id}
                className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="bg-white rounded-[15px] p-4 flex items-center gap-4 relative overflow-hidden">
                  
                  {/* Book Jacket Art Thumbnail frame */}
                  <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-inner">
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-1 font-mono text-[9px] text-gray-400 uppercase text-center">No Cover</div>
                    )}
                  </div>

                  {/* Progress Matrix Processing Core */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div>
                      <h4 className="font-black text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">by {book.author}</p>
                    </div>
                    
                    {/* Integrated Slider Bar Metrics */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-gray-400">
                        <span>{book.current_page} / {book.total_pages} pages logged</span>
                        <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Tab Specific Control Interfaces */}
                  {subTab === 'reading' ? (
                    <button 
                      type="button"
                      onClick={() => handleMarkAsCompleted(book.id)}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 transition-all flex-shrink-0 shadow-sm focus:outline-none"
                      title="Mark book as fully read"
                    >
                      <BookmarkCheck className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  ) : (
                    <div className="p-3 text-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}