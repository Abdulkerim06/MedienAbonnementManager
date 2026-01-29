import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Film } from '../interfaces/film';
import { MovieResponse } from '../interfaces/movie-response';

type TrendingFilmDto = {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity?: number;

  // <-- kommt bei dir vom Backend:
  title: string;
  poster?: string;          // FULL URL
  releaseDate?: string;     // camelCase
  voteAverage?: number;     // camelCase
  voteCount?: number;       // camelCase
};

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';

  constructor(private http: HttpClient) {}

  getMoviesByName(name: string) {
    const queryNorm = normalizeTitle(name);

    return this.http
      .get<MovieResponse | any>(`${this.apiUrl}/name/${encodeURIComponent(name)}`)
      .pipe(
        map((res: any) => {
          const rawResults: any[] = res?.results ?? res ?? [];

          // ✅ 1) MAPPING: camelCase ODER snake_case -> immer snake_case Film
          const mapped: Film[] = rawResults.map(toFilm);

          // ✅ 2) SORT: exakte Titel zuerst, dann Bekanntheit (vote_count), dann Bewertung
          const sorted = mapped.sort((a, b) => {
            const ra = matchRank(a.title, queryNorm);
            const rb = matchRank(b.title, queryNorm);
            if (ra !== rb) return ra - rb;

            const vc = (b.vote_count ?? 0) - (a.vote_count ?? 0); // Bekanntheit
            if (vc !== 0) return vc;

            const va = (b.vote_average ?? 0) - (a.vote_average ?? 0); // Bewertung
            if (va !== 0) return va;

            return (b.popularity ?? 0) - (a.popularity ?? 0);
          });

          // Wenn dein Backend ein MovieResponse liefert -> so zurückgeben, sonst eins bauen
          const page = res?.page ?? 1;
          const total_pages = res?.total_pages ?? 1;
          const total_results = res?.total_results ?? sorted.length;

          return { page, results: sorted, total_pages, total_results } as MovieResponse;
        })
      );
  }



  // ✅ Trending: Backend liefert Film[] (DTO) -> wir mappen zu Film[]
  getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Observable<Film[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trending/${timeWindow}`).pipe(
      map(movies =>
        movies.map(m => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          popularity: m.popularity ?? 0,

          // 🔥 hier der wichtige Teil:
          poster_path: m.poster
            ? m.poster.replace('https://image.tmdb.org/t/p/w92', '')
            : '',

          release_date: m.releaseDate ?? '',
          vote_average: m.voteAverage ?? 0,
          vote_count: m.voteCount ?? 0,

          adult: false,
          backdrop_path: '',
          genre_ids: [],
          original_language: '',
          original_title: m.title,
          video: false
        }))
      )
    );
  }

}

// --- helpers ---

function toFilm(m: any): Film {
  return {
    adult: m.adult ?? false,
    backdrop_path: m.backdrop_path ?? m.backdropPath ?? '',
    genre_ids: m.genre_ids ?? m.genreIds ?? [],
    id: m.id,
    original_language: m.original_language ?? m.originalLanguage ?? '',
    original_title: m.original_title ?? m.originalTitle ?? m.title ?? '',
    overview: m.overview ?? '',
    popularity: m.popularity ?? 0,
    poster_path: m.poster_path ?? m.posterPath ?? '', // (bei Search meist TMDB path)
    release_date: m.release_date ?? m.releaseDate ?? '',
    title: m.title ?? '',
    video: m.video ?? false,
    vote_average: m.vote_average ?? m.voteAverage ?? 0,
    vote_count: m.vote_count ?? m.voteCount ?? 0,
  };
}

function normalizeTitle(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 0 = exakt, 1 = startsWith, 2 = enthält, 3 = sonst */
function matchRank(title: string, queryNorm: string): number {
  const t = normalizeTitle(title);
  if (!queryNorm) return 3;
  if (t === queryNorm) return 0;
  if (t.startsWith(queryNorm)) return 1;
  if (t.includes(queryNorm)) return 2;
  return 3;
}
