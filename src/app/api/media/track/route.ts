import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize backend connection client using your environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { item, mediaType } = await request.json();

    if (!item || !mediaType) {
      return NextResponse.json({ error: 'Missing target tracking parameters' }, { status: 400 });
    }

    // Map properties cleanly to your Postgres database columns
    const dbPayload = {
      media_id: String(item.id),
      title: item.title,
      media_type: mediaType,
      poster: item.poster,
      release_date: item.releaseDate || null,
      status: 'watchlist'
    };

    // Upsert avoids duplicate failures by updating the record gracefully if it exists
    const { data, error } = await supabase
      .from('tracked_media')
      .upsert(dbPayload, { onConflict: 'media_id,media_type' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('🚨 PERSISTENCE PIPELINE ENGINE CRASH:', error.message || error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}