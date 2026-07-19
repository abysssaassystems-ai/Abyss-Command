import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize backend connection client using your environment variables
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Downgraded to Anon Key to respect RLS boundaries
);

export async function POST(request: NextRequest) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 1 & 2 Identity Gate)
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

    // 2. PARSE AND SANITIZE PAYLOAD INGESTION
    const { item, mediaType } = await request.json();

    if (!item || !mediaType) {
      return NextResponse.json({ error: 'Missing target tracking parameters' }, { status: 400 });
    }

    // 3. SECURE MULTI-TENANT PAYLOAD BINDING
    // We explicitly append the server-verified user.id to enforce tenant isolation.
    const dbPayload = {
      user_id: user.id, // Absolute anchor point for Row-Level Security
      media_id: String(item.id),
      title: item.title,
      media_type: mediaType,
      poster: item.poster,
      release_date: item.releaseDate || null,
      status: 'watchlist'
    };

    // 4. PERSISTENCE TRANSACTION WITH USER BOUNDARIES
    // NOTE: Your database unique constraint/index must be updated to: (user_id, media_id, media_type)
    const { data, error } = await supabaseServer
      .from('tracked_media')
      .upsert(dbPayload, { onConflict: 'user_id,media_id,media_type' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('🚨 PERSISTENCE PIPELINE ENGINE CRASH:', error.message || error);
    
    // Mask structural exceptions to prevent structural data leaks to the caller
    return NextResponse.json(
      { error: 'Internal persistence pipeline failure.' }, 
      { status: 500 }
    );
  }
}