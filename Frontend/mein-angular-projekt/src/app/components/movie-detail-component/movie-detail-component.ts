import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Film } from '../../interfaces/film';
import { MovieProvider } from '../../interfaces/movie-provider';
import { MovieWatchOptions } from '../../interfaces/movie-watch-options';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-detail-component.html',
  styleUrl: './movie-detail-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailComponent implements OnInit {
  movie: Film | null = null;
  providers: MovieProvider[] = [];
  watchOptions: MovieWatchOptions | null = null;
  isLoading = true;
  isLoadingProviders = false;
  isLoadingWatchOptions = false;
  errorMessage = '';
  providersErrorMessage = '';
  watchOptionsErrorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly movieService: MovieService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(movieId) || movieId <= 0) {
      this.errorMessage = 'Ungueltige Film-ID.';
      this.isLoading = false;
      return;
    }

    const cachedMovie = this.movieService.getCachedMovie(movieId);
    if (cachedMovie) {
      this.movie = cachedMovie;
      this.isLoading = false;
    }

    this.movieService.getMovieById(movieId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (movie) => {
          this.movie = movie;
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: () => {
          if (!this.movie) {
            this.errorMessage = 'Der Film konnte nicht geladen werden.';
          }
          this.cdr.markForCheck();
        }
      });

    this.loadProviders(movieId);
    this.loadWatchOptions(movieId);
  }

  protected get posterUrl(): string | null {
    return this.movie?.poster_path ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}` : null;
  }

  protected get backdropUrl(): string | null {
    return this.movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}` : null;
  }

  protected getGenreLabel(genre: { id: number; name: string } | string): string {
    return typeof genre === 'string' ? genre : genre.name;
  }

  protected get genresText(): string {
    if (!this.movie?.genres?.length) {
      return 'Nicht verfuegbar';
    }

    return this.movie.genres.map((genre) => this.getGenreLabel(genre)).join(', ');
  }

  protected get spokenLanguagesText(): string {
    const languages = this.movie?.spoken_languages ?? [];
    if (!languages.length) {
      return this.movie?.original_language?.toUpperCase() || 'Unbekannt';
    }

    return languages
      .map((language) => language.english_name || language.name)
      .filter((language): language is string => !!language)
      .join(', ');
  }

  protected get productionCompaniesText(): string {
    const companies = this.movie?.production_companies ?? [];
    if (!companies.length) {
      return 'Nicht verfuegbar';
    }

    return companies.map((company) => company.name).join(', ');
  }

  protected get releaseYear(): string {
    return this.movie?.release_date ? new Date(this.movie.release_date).getFullYear().toString() : 'Unbekannt';
  }

  protected get runtimeLabel(): string {
    const runtime = this.movie?.runtime;
    if (!runtime) {
      return 'Nicht verfuegbar';
    }

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (!hours) {
      return `${minutes} Min.`;
    }

    if (!minutes) {
      return `${hours} Std.`;
    }

    return `${hours} Std. ${minutes} Min.`;
  }

  protected get scoreLabel(): string {
    return `${(this.movie?.vote_average ?? 0).toFixed(1)} / 10`;
  }

  protected get facts(): Array<{ label: string; value: string }> {
    if (!this.movie) {
      return [];
    }

    return [
      { label: 'Erscheinungsjahr', value: this.releaseYear },
      { label: 'Laufzeit', value: this.runtimeLabel },
      { label: 'Originaltitel', value: this.movie.original_title || this.movie.title },
      { label: 'Originalsprache', value: this.movie.original_language?.toUpperCase() || 'Unbekannt' },
      { label: 'Gesprochene Sprachen', value: this.spokenLanguagesText },
      { label: 'Status', value: this.movie.status || 'Nicht verfuegbar' },
      { label: 'Genres', value: this.genresText },
      { label: 'Produktionsfirmen', value: this.productionCompaniesText }
    ];
  }

  protected providerBadgeClass(provider: MovieProvider): string {
    return provider.ownedByUser
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
      : 'border-white/10 bg-white/5 text-gray-200';
  }

  protected get watchLink(): string | null {
    return this.watchOptions?.link ?? null;
  }

  protected get watchGroups() {
    return this.watchOptions?.groups ?? [];
  }

  private loadProviders(movieId: number): void {
    this.isLoadingProviders = true;
    this.providersErrorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getMovieProviders(movieId)
      .pipe(finalize(() => {
        this.isLoadingProviders = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (providers) => {
          this.providers = (providers ?? []).filter((provider) => provider.ownedByUser);
          this.providersErrorMessage = '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.providers = [];
          this.providersErrorMessage = 'Provider konnten nicht geladen werden.';
          this.cdr.markForCheck();
        }
      });
  }

  private loadWatchOptions(movieId: number): void {
    this.isLoadingWatchOptions = true;
    this.watchOptionsErrorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getMovieWatchOptions(movieId)
      .pipe(finalize(() => {
        this.isLoadingWatchOptions = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (watchOptions) => {
          this.watchOptions = watchOptions;
          this.watchOptionsErrorMessage = '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.watchOptions = null;
          this.watchOptionsErrorMessage = 'Allgemeine Provider konnten nicht geladen werden.';
          this.cdr.markForCheck();
        }
      });
  }
}
