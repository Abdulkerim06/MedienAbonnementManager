import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { Film } from '../interfaces/film';
import { MovieProvider } from '../interfaces/movie-provider';
import { MovieResponse } from '../interfaces/movie-response';
import { MovieWatchOptions, WatchProviderGroup, WatchProviderItem } from '../interfaces/movie-watch-options';
import { KeycloakOperationService } from './keycloak.service';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';
  private movieCache = new Map<number, Film>();

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakOperationService
  ) {}

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

  getMovieProviders(id: number, country: string = 'AT'): Observable<MovieProvider[]> {
    return from(this.createAuthHeaders()).pipe(
      switchMap((headers) => {
        const authenticated = headers.has('Authorization');
        const userRoute = `${this.apiUrl}/${id}/providers/for-user?country=${country}`;
        const publicRoute = `${this.apiUrl}/${id}/providers/filtered?country=${country}`;

        if (!authenticated) {
          return this.http.get<MovieProvider[]>(publicRoute);
        }

        return this.http.get<MovieProvider[]>(userRoute, { headers }).pipe(
          catchError(() => this.http.get<MovieProvider[]>(publicRoute))
        );
      })
    );
  }

  getMovieWatchOptions(id: number, country: string = 'AT'): Observable<MovieWatchOptions> {
    return this.http.get<any>(`${this.apiUrl}/${id}/providers`).pipe(
      map((response) => this.normalizeWatchOptions(response, country))
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

  private async createAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.keycloak.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  private normalizeWatchOptions(response: any, country: string): MovieWatchOptions {
    const countryResult = response?.results?.[country] ?? {};

    const groups: WatchProviderGroup[] = [
      { label: 'Streaming', providers: this.mapWatchProviders(countryResult?.flatrate) },
      { label: 'Leihen', providers: this.mapWatchProviders(countryResult?.rent) },
      { label: 'Kaufen', providers: this.mapWatchProviders(countryResult?.buy) }
    ].filter((group) => group.providers.length > 0);

    return {
      countryCode: country,
      link: countryResult?.link ?? null,
      groups
    };
  }

  private mapWatchProviders(items: any[] | undefined): WatchProviderItem[] {
    return (items ?? []).map((item) => ({
      providerId: item?.provider_id ?? 0,
      providerName: item?.provider_name ?? '',
      logoUrl: item?.logo_path ? `https://image.tmdb.org/t/p/w92${item.logo_path}` : ''
    }));
  }
}
