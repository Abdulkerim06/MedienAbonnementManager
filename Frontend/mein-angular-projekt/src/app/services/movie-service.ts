import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Film } from '../interfaces/film';
import { MovieResponse } from '../interfaces/movie-response';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';

  constructor(private http: HttpClient) {}

  // 🔎 Search (Backend gibt MovieResponse zurück, mit page support)
  getMoviesByName(name: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/name/${encodeURIComponent(name)}?page=${page}`
    );
  }

  // 🎬 Trending (Backend gibt DTO-Liste zurück -> wir mappen zu Film[])
  getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Observable<Film[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trending/${timeWindow}`).pipe(
      map(movies =>
        (movies ?? []).map(m => ({
          id: m.id,
          title: m.title ?? '',
          overview: m.overview ?? '',
          popularity: m.popularity ?? 0,

          // ✅ aus FULL poster URL den TMDB path machen (robust)
          poster_path: m.poster
            ? new URL(m.poster).pathname.replace(/^\/t\/p\/w\d+/, '')
            : '',

          release_date: m.releaseDate ?? '',
          vote_average: m.voteAverage ?? 0,
          vote_count: m.voteCount ?? 0,

          adult: false,
          backdrop_path: '',
          genre_ids: [],
          original_language: '',
          original_title: m.title ?? '',
          video: false
        }))
      )
    );
  }

}
