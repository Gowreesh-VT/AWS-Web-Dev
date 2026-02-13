import type { Movie, SearchHistoryItem } from './types';

// This is a mock database. In a real application, you would use a database like Firestore.
let favorites: Movie[] = [];
let history: SearchHistoryItem[] = [];

export async function getFavorites(): Promise<Movie[]> {
  return favorites;
}

export async function addFavorite(movie: Movie): Promise<Movie> {
  if (!favorites.find(fav => fav.id === movie.id)) {
    favorites.push(movie);
  }
  return movie;
}

export async function removeFavorite(movieId: number): Promise<{ id: number }> {
  favorites = favorites.filter(fav => fav.id !== movieId);
  return { id: movieId };
}

export async function isFavorite(movieId: number): Promise<boolean> {
  return !!favorites.find(fav => fav.id === movieId);
}

export async function getHistory(): Promise<SearchHistoryItem[]> {
  return history;
}

export async function addHistory(item: SearchHistoryItem): Promise<SearchHistoryItem> {
  history.unshift(item);
  // Limit history to the last 20 searches
  if (history.length > 20) {
    history = history.slice(0, 20);
  }
  return item;
}
