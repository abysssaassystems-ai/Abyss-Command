'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import Next.js router
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter(); // 2. Initialize the router

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) { // 3. Properly typed form event
    e.preventDefault();
    setError('');

    // Safely pull values out of the form elements
    const target = e.currentTarget;
    const email = (target.elements.namedItem('email') as HTMLInputElement).value;
    const password = (target.elements.namedItem('password') as HTMLInputElement).value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 4. Client-side redirect to the dashboard route
    router.push('/dashboard'); 
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F3F4F6]">
      <Navbar />

      <div className="flex items-center justify-center px-6 pt-24">
        <div className="w-full max-w-md bg-[#121824] border border-gray-800 rounded-2xl p-10 shadow-2xl">

          <h1 className="text-3xl font-extrabold text-white text-center tracking-wide">
            System Login
          </h1>

          <form onSubmit={handleLogin} className="mt-10 flex flex-col gap-6">
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#0B0F17] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
            />

            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#0B0F17] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00F2FE]"
            />

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-[#0B0F17] py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity"
            >
              Enter Workspace
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}