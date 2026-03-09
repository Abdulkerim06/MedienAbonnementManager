export interface Film {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  genres?: Array<{ id: number; name: string }> | string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  runtime?: number;
  tagline?: string;
  title: string;
  video: boolean;

  vote_average?: number;
  vote_count?: number;
}
