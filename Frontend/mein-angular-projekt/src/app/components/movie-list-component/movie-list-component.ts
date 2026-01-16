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
    this.searchMovies('Thor'); // Beispielaufruf
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

          this.movies = response.results;

          // 2️⃣ Anfrage erfolgreich, aber keine Ergebnisse
          if (this.movies.length === 0) {
            this.errorMessage = 'Keine Filme gefunden.';
          }
        },
        error: (error) => {
          console.error('❌ Fehler:', error);

          // 3️⃣ Technischer Fehler
          this.errorMessage = 'Fehler beim Laden der Filme.';
        }
      });
  }

}
