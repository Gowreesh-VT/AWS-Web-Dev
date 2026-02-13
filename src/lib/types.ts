export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface SearchHistoryItem {
  id: string;
  mood: string;
  genres: string[];
  timestamp: string;
}
