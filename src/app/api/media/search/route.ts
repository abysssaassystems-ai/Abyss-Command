import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    switch (type) {
      case 'movie':
      case 'tv':
        const tmdbData = await searchTMDB(query, type);
        return NextResponse.json({ results: tmdbData });

      case 'gaming':
        const igdbData = await searchIGDB(query);
        return NextResponse.json({ results: igdbData });

      case 'books':
        const booksData = await searchGoogleBooks(query);
        return NextResponse.json({ results: booksData });

      default:
        return NextResponse.json({ error: 'Invalid media type category specified' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('--- 🚨 MEDIA SEARCH BACKEND CRASH LOG ---');
    console.error('Scope Type:', type);
    console.error('User Query:', query);
    console.error('Error Details:', error.message || error);
    console.error('-----------------------------------------');
    
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message }, 
      { status: 500 }
    );
  }
}

// 🎬 ADAPTIVE TMDB AUTHENTICATION ENGINE (Handles both Key and Token variants cleanly)
async function searchTMDB(query: string, type: 'movie' | 'tv') {
  const v3Key = (process.env.TMDB_API_KEY || '').trim();
  const v4Token = (process.env.TMDB_ACCESS_TOKEN || '').trim();
  console.log("🔍 DEBUGLOG: What key is Next.js actually sending?", v3Key);

  let url = '';
  const options: RequestInit = { method: 'GET', cache: 'no-store' };

  // Strategy A: If a clear 32-character short API key exists, execute Query Parameter flow
  if (v3Key && v3Key.length < 50) {
    url = `https://api.themoviedb.org/3/search/${type}?api_key=${v3Key}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    options.headers = { accept: 'application/json' };
  } 
  // Strategy B: If only the long Read Access Token is present, execute HTTP Header Bearer flow
  else if (v4Token && v4Token.startsWith('eyJ')) {
    url = `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    options.headers = {
      accept: 'application/json',
      Authorization: `Bearer ${v4Token}`,
    };
  } 
  else {
    throw new Error('No valid TMDB_API_KEY (v3 short string) or TMDB_ACCESS_TOKEN (v4 long string) identified inside environment keys.');
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`TMDB connection failure status: ${res.status} - ${errorBody}`);
  }
  
  const data = await res.json();
  return (data.results || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name,
    releaseDate: item.release_date || item.first_air_date,
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    overview: item.overview,
  }));
}

// 🎮 IGDB GAMING SEARCH ENGINE
async function searchIGDB(query: string) {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('Missing Twitch developer app credentials in environment variables');
  }

  const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
  
  const authRes = await fetch(authUrl, { method: 'POST', cache: 'no-store' });
  if (!authRes.ok) throw new Error(`Twitch OAuth authentication loop failure: ${authRes.status}`);
  const authData = await authRes.json();
  const token = authData.access_token;

  const bodyPayload = `search "${query}"; fields name, cover.url, first_release_date, platforms.name; limit 10;`;
  
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`IGDB database response error: ${res.status} - ${errText}`);
  }
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
  if (!res.ok) throw new Error(`Google Books interface returned error: ${res.status}`);
  const data = await res.json();

  return (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || 'Unknown Author',
    releaseDate: item.volumeInfo.publishedDate,
    poster: item.volumeInfo.imageLinks?.thumbnail || null,
    totalPages: item.volumeInfo.pageCount || null,
  }));
}