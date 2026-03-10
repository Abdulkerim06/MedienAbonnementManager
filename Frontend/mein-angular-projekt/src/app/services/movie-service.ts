import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Film } from '../interfaces/film';
import { MovieResponse } from '../interfaces/movie-response';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';
  private movieCache = new Map<number, Film>();

  constructor(private http: HttpClient) {}

  getMoviesByName(name: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/name/${encodeURIComponent(name)}?page=${page}`
    ).pipe(
      map((response) => ({
        ...response,
        results: (response.results ?? []).map((movie) => this.cacheMovie(this.normalizeMovie(movie)))
      }))
    );
  }

  getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Observable<Film[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trending/${timeWindow}`).pipe(
      map((movies) => (movies ?? []).map((movie) => this.cacheMovie(this.normalizeMovie(movie))))
    );
  }

  getMovieById(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/id/${id}`).pipe(
      map((movie) => this.cacheMovie(this.normalizeMovie(movie)))
    );
  }

  getCachedMovie(id: number): Film | undefined {
    return this.movieCache.get(id);
  }

  private cacheMovie(movie: Film): Film {
    this.movieCache.set(movie.id, movie);
    return movie;
  }

  private normalizeMovie(movie: Partial<Film> & Record<string, any>): Film {
    return {
      adult: movie.adult ?? false,
      backdrop_path: this.extractImagePath(movie.backdrop_path ?? movie['backdrop']),
      budget: movie.budget ?? 0,
      genre_ids: movie.genre_ids ?? [],
      genres: movie.genres ?? [],
      homepage: movie.homepage ?? '',
      id: movie.id ?? 0,
      original_language: movie.original_language ?? movie['originalLanguage'] ?? '',
      original_title: movie.original_title ?? movie['originalTitle'] ?? movie.title ?? '',
      overview: movie.overview ?? '',
      popularity: movie.popularity ?? 0,
      poster_path: this.extractImagePath(movie.poster_path ?? movie['poster']),
      production_companies: movie.production_companies ?? [],
      production_countries: movie.production_countries ?? [],
      release_date: movie.release_date ?? movie['releaseDate'] ?? '',
      revenue: movie.revenue ?? 0,
      runtime: movie.runtime,
      spoken_languages: movie.spoken_languages ?? [],
      status: movie.status ?? '',
      tagline: movie.tagline ?? '',
      title: movie.title ?? '',
      video: movie.video ?? false,
      vote_average: movie.vote_average ?? movie['voteAverage'] ?? 0,
      vote_count: movie.vote_count ?? movie['voteCount'] ?? 0
    };
  }

  private extractImagePath(value?: string | null): string {
    if (!value) {
      return '';
    }

    if (value.startsWith('/')) {
      return value;
    }

    try {
      return new URL(value).pathname.replace(/^\/t\/p\/w\d+/, '');
    } catch {
      return '';
    }
  }
}
