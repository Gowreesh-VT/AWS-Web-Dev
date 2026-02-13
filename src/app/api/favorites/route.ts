import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import type { Movie } from '@/lib/types';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(user.favorites);
  } catch (error) {
    console.error('[API/FAVORITES GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movie = await request.json() as Movie;
    if (!movie || !movie.id) {
      return NextResponse.json({ error: 'Invalid movie data provided.' }, { status: 400 });
    }

    // Check if already exists
    const exists = user.favorites.some((fav) => fav.id === movie.id);
    if (exists) {
      return NextResponse.json({ message: 'Movie already in favorites' }, { status: 200 });
    }

    user.favorites.push(movie);
    await user.save();

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('[API/FAVORITES POST] Error:', error);
    return NextResponse.json({ error: 'Failed to add favorite.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Movie ID is required.' }, { status: 400 });
    }

    user.favorites = user.favorites.filter((fav) => fav.id !== Number(id));
    await user.save();

    return NextResponse.json({ success: true, id: Number(id) });
  } catch (error) {
    console.error('[API/FAVORITES DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to remove favorite.' }, { status: 500 });
  }
}
