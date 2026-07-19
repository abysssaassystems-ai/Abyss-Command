import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// Initialize a server-safe configuration instance to verify incoming tokens safely
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 2 & 3 Gate)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing identity validation token.' }, 
        { status: 401 }
      );
    }

    // Authenticate the token directly against the Supabase Auth engine
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authorization credentials invalid or expired.' }, 
        { status: 401 }
      );
    }

    // 2. PARSE AND SANITIZE PARAMS AFTER SUCCESSFUL AUTH
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';
    const type = searchParams.get('type') || '';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Securely tie search telemetry internally to the verified tenant user ID
    console.log(`🔍 MEDIA SEARCH: Tenant [${user.id}] executing ${type} search for "${query.substring(0, 30)}"`);

    switch (type) {
      case 'movie':
      case 'tv':
        const tmdbData = await searchTMDB(query, type);
        return NextResponse.json({ success: true, results: tmdbData });

      case 'gaming':
        const igdbData = await searchIGDB(query);
        return NextResponse.json({ success: true, results: igdbData });

      case 'books':
        const booksData = await searchGoogleBooks(query);
        return NextResponse.json({ success: true, results: booksData });

      default:
        return NextResponse.json({ error: 'Invalid media type category specified' }, { status: 400 });
    }

  } catch (error: any) {
    // Secure internal logging that remains isolated on your server console
    console.error('--- 🚨 SECURED MEDIA SEARCH BACKEND CRASH LOG ---');
    console.error('Error Details:', error.message || error);
    console.error('-----------------------------------------');
    
    // Mask raw exceptions to prevent systemic data leaks to the caller
    return NextResponse.json(
      { error: 'Internal pipeline processing failure.', results: [] }, 
      { status: 500 }
    );
  }
}

// 🎬 ADAPTIVE TMDB AUTHENTICATION ENGINE
async function searchTMDB(query: string, type: 'movie' | 'tv') {
  const v3Key = (process.env.TMDB_API_KEY || '').trim();
  const v4Token = (process.env.TMDB_ACCESS_TOKEN || '').trim();

  let url = '';
  const options: RequestInit = { method: 'GET', cache: 'no-store' };

  if (v3Key && v3Key.length < 50) {
    url = `https://api.themoviedb.org/3/search/${type}?api_key=${v3Key}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    options.headers = { accept: 'application/json' };
  } 
  else if (v4Token && v4Token.startsWith('eyJ')) {
    url = `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    options.headers = {
      accept: 'application/json',
      Authorization: `Bearer ${v4Token}`,
    };
  } 
  else {
    throw new Error('Missing verified upstream TMDB environment configuration keys.');
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`TMDB connection failure status: ${res.status}`);
  
  const data = await res.json();
  return (data.results || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name,
    releaseDate: item.release_date || item.first_air_date,
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    overview: item.overview || '',
  }));
}

// 🎮 IGDB GAMING SEARCH ENGINE
async function searchIGDB(query: string) {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('Missing Twitch developer app credentials in environment variables');
  }

  const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
  
  const authRes = await fetch(authUrl, { method: 'POST', cache: 'no-store' });
  if (!authRes.ok) throw new Error(`Twitch OAuth identification loop failure.`);
  
  const authData = await authRes.json();
  const token = authData.access_token;

  // Simple string sanitization to protect the raw text payload template from breaking
  const sanitizedQuery = query.replace(/"/g, '\\"');
  const bodyPayload = `search "${sanitizedQuery}"; fields name, cover.url, first_release_date, platforms.name; limit 10;`;
  
  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: bodyPayload,
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`IGDB database response error.`);
  const games = await res.json();

  return (games || []).map((game: any) => ({
    id: game.id,
    title: game.name,
    releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
    poster: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
    platforms: game.platforms?.map((p: any) => p.name) || [],
  }));
}

// 📚 GOOGLE BOOKS SEARCH ENGINE
async function searchGoogleBooks(query: string) {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    throw new Error('Missing GOOGLE_BOOKS_API_KEY env variable');
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Google Books interface returned error status.`);
  const data = await res.json();

  return (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || 'Unknown Author',
    releaseDate: item.volumeInfo.publishedDate || '',
    poster: item.volumeInfo.imageLinks?.thumbnail || null,
    totalPages: item.volumeInfo.pageCount || null,
  }));
}