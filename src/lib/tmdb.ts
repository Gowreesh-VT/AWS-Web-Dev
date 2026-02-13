import type { Movie } from './types';
import { PlaceHolderImages } from './placeholder-images';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

// This is a simplified genre map. A real app would fetch this from TMDB's /genre/movie/list endpoint.
const GENRE_MAP: { [key: string]: number } = {
  "action": 28, "adventure": 12, "animation": 16, "comedy": 35, "crime": 80,
  "documentary": 99, "drama": 18, "family": 10751, "fantasy": 14, "history": 36,
  "horror": 27, "music": 10402, "musical": 10402, "mystery": 9748, "romance": 10749,
  "sci-fi": 878, "science fiction": 878, "tv movie": 10770, "thriller": 53,
  "war": 10752, "western": 37
};

export function getGenreIds(genres: string[]): number[] {
  return genres.map(g => GENRE_MAP[g.toLowerCase()]).filter(id => id !== undefined);
}

export async function fetchMoviesByGenres(genreIds: number[]): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured. Please add it to your .env file.');
  }

  const genreQuery = genreIds.join(',');
  const url = `${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error('Failed to fetch from TMDB:', await response.text());
    throw new Error('Failed to fetch movies from TMDB.');
  }
  const data = await response.json();
  return (data.results || []).slice(0, 20) as Movie[];
}

export function getMoviePosterUrl(path: string | null): string {
  if (!path) {
    const fallbackImage = PlaceHolderImages.find(img => img.id === 'movie-poster-fallback');
    return fallbackImage ? fallbackImage.imageUrl : 'https://picsum.photos/seed/movie-poster/500/750';
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
}
