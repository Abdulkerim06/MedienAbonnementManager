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
}
