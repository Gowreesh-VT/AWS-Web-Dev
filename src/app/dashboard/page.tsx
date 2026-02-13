"use client";

import { useState, useEffect } from 'react';
import { MoodForm } from '@/components/movies/mood-form';
import { MovieList } from '@/components/movies/movie-list';
import { GenrePills } from '@/components/movies/genre-pills';
import type { Movie } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          console.error('Failed to fetch favorites.');
          return;
        }
        const data: Movie[] = await response.json();
        setFavoriteIds(data.map(m => m.id));
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'An unknown error occurred while fetching favorites.');
      }
    };
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (movie: Movie, isFavorite: boolean) => {
    setFavoriteIds(currentIds => 
      isFavorite 
        ? [...currentIds, movie.id]
        : currentIds.filter(id => id !== movie.id)
    );
  };

  const handleMoodSubmit = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setMovies([]);
    setGenres([]);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations.');
      }

      const data = await response.json();
      setMovies(data.movies);
      setGenres(data.genres);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold font-headline">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Tell us your mood, and our AI will find the perfect movies for you.
          </p>
          <MoodForm onSubmit={handleMoodSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && (
         <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6 justify-center items-center">
            <span className="text-sm font-medium text-muted-foreground self-center">Generating genres...</span>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-lg" />
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searched && !isLoading && !error && (
        <div className="max-w-6xl mx-auto">
          {genres.length > 0 && <GenrePills genres={genres} />}
          {movies.length > 0 ? (
            <MovieList movies={movies} onFavoriteChange={handleFavoriteChange} favoriteIds={favoriteIds} />
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <h3 className="text-lg font-semibold">No movies found</h3>
              <p>We couldn't find any movies for the genres: {genres.join(', ')}. Try a different mood!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
