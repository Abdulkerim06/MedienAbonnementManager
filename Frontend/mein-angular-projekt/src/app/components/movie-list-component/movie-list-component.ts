// src/app/components/movie-list/movie-list.component.ts
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- wichtig für *ngIf, *ngFor, Pipes
import { MovieService } from '../../services/movie-service';
import { Film } from '../../interfaces/film';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {finalize, forkJoin} from 'rxjs';

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
  // 🔎 / 🔥 View-State
  viewMode: 'trending' | 'search' = 'trending';
  activeTrending: 'day' | 'week' = 'day';

  // ✅ Pagination-State
  currentQuery = '';
  currentPage = 1;
  totalPages = 1;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTrendingMovies('day');
  }

  // =========================
  // 🔍 SEARCH ENTRY POINT
  // =========================
  searchMovies(name: string): void {
    if (!name.trim()) return;

    this.viewMode = 'search';
    this.currentQuery = name;

    this.loadSearchPage(1);
  }

  // =========================
  // 📄 LOAD ONE PAGE
  // =========================
  loadSearchPage(page: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getMoviesByName(this.currentQuery, page)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (response) => {
          this.currentPage = response.page ?? page;
          this.totalPages = response.total_pages ?? 1;

          const results = (response.results ?? []).slice();

          // ⭐ meist bewertete zuerst
          results.sort((a, b) => {
            const vc = (b.vote_count ?? 0) - (a.vote_count ?? 0);
            if (vc !== 0) return vc;

            const va = (b.vote_average ?? 0) - (a.vote_average ?? 0);
            if (va !== 0) return va;

            return (b.popularity ?? 0) - (a.popularity ?? 0);
          });

          this.movies = results;

          if (this.movies.length === 0) {
            this.errorMessage = 'Keine Filme gefunden.';
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('❌ Fehler:', error);
          this.errorMessage = 'Fehler beim Laden der Filme.';
          this.cdr.markForCheck();
        }
      });
  }

  // =========================
  // ⬅️➡️ PAGINATION
  // =========================
  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadSearchPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadSearchPage(this.currentPage + 1);
    }
  }

  // =========================
  // 🔥 TRENDING
  // =========================
  loadTrendingMovies(timeWindow: 'day' | 'week'): void {
    this.viewMode = 'trending';
    this.activeTrending = timeWindow;

    // Pagination zurücksetzen
    this.currentQuery = '';
    this.currentPage = 1;
    this.totalPages = 1;

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
          if (this.movies.length === 0) {
            this.errorMessage = 'Keine Trending-Filme gefunden.';
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Fehler beim Laden der Trending-Filme.';
          this.cdr.markForCheck();
        }
      });
  }



}


