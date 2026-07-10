import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 🎬 TMDB Standard Numeric Genre IDs Mapping Array
const TMDB_GENRE_MAP: Record<string, number> = {
  'action': 28,
  'sci-fi': 878,
  'drama': 18,
  'fantasy': 14,
  'horror': 27,
  'documentary': 99,
  'crime': 80,
  'romance': 10749,
  'comedy': 35,
  'animation': 16
};

// 🎮 IGDB Native String Token Filtering Arrays
const IGDB_GENRE_MAP: Record<string, string> = {
  'action': '(genres.name = "Action" | genres.name = "Adventure" | genres.name = "Shooter")',
  'sci-fi': '(genres.name = "Science fiction")',
  'drama': '(genres.name = "Drama")',
  'fantasy': '(genres.name = "Fantasy")',
  'horror': '(genres.name = "Horror")',
  'documentary': '(genres.name = "Simulator" | themes.name = "Historical" | genres.name = "Quiz/Trivia")',
  'crime': '(themes.name = "Mystery" | genres.name = "Adventure")',
  'romance': '(themes.name = "Romance" | genres.name = "Visual Novel")',
  'comedy': '(themes.name = "Comedy")',
  'animation': '(themes.name = "Anime" | themes.name = "Kids")'
};

// 📚 Google Books Sub-Category Search Query Mapping Array
const BOOK_GENRE_MAP: Record<string, string> = {
  'action': 'action+adventure',
  'sci-fi': '"science fiction"',
  'drama': 'drama',
  'fantasy': 'fantasy',
  'horror': 'horror+thriller',
  'documentary': 'biography+history+nonfiction',
  'crime': 'true+crime+mystery',
  'romance': 'romance+fiction',
  'comedy': 'humor+comedy',
  'animation': 'comics+graphic+novels'
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie'; // Default cleanly to movie path
  const genre = searchParams.get('genre') || 'action'; // Default cleanly to action path
  const year = searchParams.get('year') || 'all';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  try {
    let results: any[] = [];

    // Clean, direct routing pathways that never mix pipelines
    switch (type) {
      case 'movie':
      case 'tv':
        results = await discoverTMDB(type, genre, year, page);
        break;
      case 'gaming':
        results = await discoverIGDB(genre, year, page);
        break;
      case 'books':
        results = await discoverBooks(genre, year, page);
        break;
      default:
        results = await discoverTMDB('movie', genre, year, page);
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('🚨 TAXONOMY ROUTER DISPATCH FAILURE:', error.message);
    return NextResponse.json({ error: 'Internal Stream Failure', results: [] }, { status: 500 });
  }
}

async function discoverTMDB(category: 'movie' | 'tv', genre: string, year: string, page: number) {
  const apiKey = (process.env.TMDB_API_KEY || '').trim();
  if (!apiKey) return [];

  let url = `https://api.themoviedb.org/3/discover/${category}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false`;

  if (year !== 'all' && year.trim() !== '') {
    const yearParam = category === 'movie' ? 'primary_release_year' : 'first_air_date_year';
    url += `&${yearParam}=${year.trim()}`;
  }
  
  if (TMDB_GENRE_MAP[genre]) {
    url += `&with_genres=${TMDB_GENRE_MAP[genre]}`;
  }

  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.results || []).map((item: any) => ({
    id: `tmdb-${category}-${item.id}`,
    title: item.title || item.name,
    releaseDate: item.release_date || item.first_air_date,
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    overview: item.overview || '',
    displayType: category === 'movie' ? 'Movie' : 'TV Show'
  }));
}

async function discoverIGDB(genre: string, year: string, page: number) {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) return [];
  
  try {
    const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
    const authRes = await fetch(authUrl, { method: 'POST' });
    if (!authRes.ok) return [];
    const authData = await authRes.json();

    let queryConditions = 'where cover != null & popularity > 0.1';
    const limit = 20;
    const offset = (page - 1) * limit;

    if (year !== 'all' && year.trim() !== '') {
      const targetYear = parseInt(year.trim(), 10);
      const startUnix = Math.floor(new Date(`${targetYear}-01-01T00:00:00Z`).getTime() / 1000);
      const endUnix = Math.floor(new Date(`${targetYear}-12-31T23:59:59Z`).getTime() / 1000);
      queryConditions += ` & first_release_date >= ${startUnix} & first_release_date <= ${endUnix}`;
    }
    
    if (IGDB_GENRE_MAP[genre]) {
      queryConditions += ` & ${IGDB_GENRE_MAP[genre]}`;
    }

    const bodyPayload = `fields name, cover.url, first_release_date, summary; ${queryConditions}; sort popularity desc; limit ${limit}; offset ${offset};`;

    const res = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'text/plain',
      },
      body: bodyPayload,
      cache: 'no-store'
    });

    if (!res.ok) return [];
    const games = await res.json();
    return games.map((game: any) => ({
      id: `igdb-game-${game.id}`,
      title: game.name,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
      poster: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
      overview: game.summary || '',
      displayType: 'Gaming'
    }));
  } catch {
    return [];
  }
}

async function discoverBooks(genre: string, year: string, page: number) {
  if (!process.env.GOOGLE_BOOKS_API_KEY) return [];

  const genreQuery = BOOK_GENRE_MAP[genre] || 'fiction';
  let searchTerms = `subject:${genreQuery}`;
  
  if (year !== 'all' && year.trim() !== '') {
    searchTerms += `+intitle:${year.trim()}`;
  }

  const limit = 20;
  const startIndex = (page - 1) * limit;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerms)}&startIndex=${startIndex}&maxResults=${limit}&printType=books&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();

  return (data.items || []).map((item: any) => ({
    id: `books-book-${item.id}`,
    title: item.volumeInfo.title,
    releaseDate: item.volumeInfo.publishedDate || '',
    poster: item.volumeInfo.imageLinks?.thumbnail || null,
    overview: item.volumeInfo.description || '',
    displayType: 'Book'
  }));
}