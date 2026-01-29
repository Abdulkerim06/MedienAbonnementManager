// src/app/components/movie-list/movie-list.component.ts
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- wichtig für *ngIf, *ngFor, Pipes
import { MovieService } from '../../services/movie-service';
import { Film } from '../../interfaces/film';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-list-component.html',
  styleUrls: ['./movie-list-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MovieListComponent implements OnInit {
  movies: Film[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTrendingMovies('day'); // oder 'week'
  }



  searchMovies(name: string): void {
    console.log('🔍 Suche gestartet mit:', name);

    // 1️⃣ Leere Eingabe → kein API-Call
    if (!name.trim()) {
      this.movies = [];
      this.errorMessage = 'Bitte einen Filmtitel eingeben.';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getMoviesByName(name)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Antwort vom Server:', response);

          const q = normalizeTitle(name);
          console.log('count:', response.results.length);
          console.log(response.results.map(m => m.title));

          this.movies = (response.results ?? [])
            .slice()
            .sort((a, b) => {
              const ra = matchRank(a.title, q);
              const rb = matchRank(b.title, q);
              if (ra !== rb) return ra - rb; // 0 ist am besten

              // 1) Bekanntheit
              const vc = (b.vote_count ?? 0) - (a.vote_count ?? 0);
              if (vc !== 0) return vc;

              // 2) Bewertung
              const va = (b.vote_average ?? 0) - (a.vote_average ?? 0);
              if (va !== 0) return va;

              // 3) Popularität
              return (b.popularity ?? 0) - (a.popularity ?? 0);
            });

          if (this.movies.length === 0) {
            this.errorMessage = 'Keine Filme gefunden.';
          }

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('❌ Fehler:', error);

          // 3️⃣ Technischer Fehler
          this.errorMessage = 'Fehler beim Laden der Filme.';
        }
      });
  }

  loadTrendingMovies(timeWindow: 'day' | 'week'): void {
    this.movies = [];
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getTrendingMovies(timeWindow)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (movies) => {
          this.movies = movies;
          if (this.movies.length === 0) this.errorMessage = 'Keine Trending-Filme gefunden.';
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Fehler beim Laden der Trending-Filme.';
          this.cdr.markForCheck();
        }
      });
  }



}

function normalizeTitle(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchRank(title: string, queryNorm: string): number {
  const t = normalizeTitle(title);

  if (!queryNorm) return 9;

  // 0: exakt (Thor)
  if (t === queryNorm) return 0;

  // 1: beginnt mit "thor:" oder "thor " (Thor: Love and Thunder / Thor Ragnarok)
  // normalizeTitle macht ":" zu space, daher prüfen wir auf startsWith(queryNorm)
  if (t.startsWith(queryNorm)) return 1;

  // 2: enthält als eigenes Wort (… thor …)
  if ((' ' + t + ' ').includes(' ' + queryNorm + ' ')) return 2;

  // 3: enthält irgendwie
  if (t.includes(queryNorm)) return 3;

  return 9;
}


