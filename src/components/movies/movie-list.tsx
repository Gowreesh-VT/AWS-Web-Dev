import type { Movie } from '@/lib/types';
import { MovieCard } from './movie-card';

interface MovieListProps {
  movies: Movie[];
  onFavoriteChange?: (movie: Movie, isFavorite: boolean) => void;
  favoriteIds?: number[];
  allFavorites?: boolean;
}

export function MovieList({ movies, onFavoriteChange, favoriteIds = [], allFavorites = false }: MovieListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map(movie => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          isFavoriteInitially={allFavorites || favoriteIds.includes(movie.id)}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
}
