"use client";

import { useState, useEffect } from 'react';
import type { Movie } from '@/lib/types';
import { MovieList } from '@/components/movies/movie-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeartCrack } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error("Failed to fetch favorites.");
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (changedMovie: Movie, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites(currentFavorites => currentFavorites.filter(m => m.id !== changedMovie.id));
    }
  };

  if (isLoading) return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Your Favorite Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[420px] rounded-lg" />
        ))}
      </div>
    </div>
  );

  if (error) return (
     <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center font-headline">Your Favorite Movies</h1>
        <Alert variant="destructive" className="max-w-md mx-auto">
            <HeartCrack className="h-4 w-4" />
            <AlertTitle>Error loading favorites</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
     </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Your Favorite Movies</h1>
      {favorites.length > 0 ? (
        <MovieList movies={favorites} onFavoriteChange={handleFavoriteChange} allFavorites />
      ) : (
        <Alert className="max-w-md mx-auto">
          <HeartCrack className="h-4 w-4" />
          <AlertTitle>No Favorites Yet</AlertTitle>
          <AlertDescription>
            You haven't saved any movies. Find some movies you like on the home page and click the heart icon to save them!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
