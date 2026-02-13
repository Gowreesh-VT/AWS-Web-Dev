import { NextResponse } from 'next/server';
import { convertMoodToGenres } from '@/ai/flows/mood-to-genre-converter';
import { fetchMoviesByGenres, getGenreIds } from '@/lib/tmdb';
import { addHistory } from '@/lib/data';
import type { SearchHistoryItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { mood } = await request.json();
    if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
      return NextResponse.json({ error: 'Mood is required and must be a non-empty string.' }, { status: 400 });
    }

    const { genres } = await convertMoodToGenres({ mood });

    if (!genres || genres.length === 0) {
      return NextResponse.json({ genres: [], movies: [] });
    }
    
    const genreIds = getGenreIds(genres);
    if (genreIds.length === 0) {
        return NextResponse.json({ genres, movies: [] });
    }
    
    const movies = await fetchMoviesByGenres(genreIds);

    const historyItem: SearchHistoryItem = {
      id: new Date().toISOString() + Math.random(),
      mood,
      genres,
      timestamp: new Date().toISOString(),
    };
    await addHistory(historyItem);
    
    return NextResponse.json({ genres, movies });
  } catch (error) {
    console.error('[API/RECOMMENDATIONS] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: `An error occurred while getting recommendations: ${errorMessage}` }, { status: 500 });
  }
}
