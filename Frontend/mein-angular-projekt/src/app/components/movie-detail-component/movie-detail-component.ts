import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Film } from '../../interfaces/film';
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
  isLoading = true;
  errorMessage = '';

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
}
