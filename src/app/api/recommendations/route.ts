import { NextResponse } from 'next/server';
import { convertMoodToGenres } from '@/ai/flows/mood-to-genre-converter';
import { fetchMoviesByGenres, getGenreIds } from '@/lib/tmdb';
import { getCurrentUser } from '@/lib/auth';
import type { SearchHistoryItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Actually we don't have uuid installed, let's use random string or install it. 
// Easier to just use Math.random for now to avoid installing another package, or just Date.now().

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

    // Save to history if user is logged in
    const user = await getCurrentUser();
    if (user) {
      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        mood,
        genres,
        timestamp: new Date().toISOString(),
      };
      user.history.push(historyItem);
      await user.save();
    }

    return NextResponse.json({ genres, movies });
  } catch (error) {
    console.error('[API/RECOMMENDATIONS] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: `An error occurred while getting recommendations: ${errorMessage}` }, { status: 500 });
  }
}
