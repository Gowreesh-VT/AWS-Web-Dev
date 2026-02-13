import { NextResponse } from 'next/server';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/data';
import type { Movie } from '@/lib/types';

export async function GET() {
  try {
    const favorites = await getFavorites();
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('[API/FAVORITES GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const movie = await request.json() as Movie;
    if (!movie || !movie.id) {
        return NextResponse.json({ error: 'Invalid movie data provided.' }, { status: 400 });
    }
    const newFavorite = await addFavorite(movie);
    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('[API/FAVORITES POST] Error:', error);
    return NextResponse.json({ error: 'Failed to add favorite.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Movie ID is required.' }, { status: 400 });
    }
    const deleted = await removeFavorite(Number(id));
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('[API/FAVORITES DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to remove favorite.' }, { status: 500 });
  }
}
