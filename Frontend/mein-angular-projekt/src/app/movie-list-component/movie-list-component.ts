// src/app/components/movie-list/movie-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- wichtig für *ngIf, *ngFor, Pipes
import { MovieService } from '../movie-service';
import { Film } from '../film';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-list-component.html',
  styleUrls: ['./movie-list-component.css']
})

export class MovieListComponent implements OnInit {
  movies: Film[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.searchMovies('Thor'); // Beispielaufruf
  }

  searchMovies(name: string): void {
    console.log('🔍 Suche gestartet mit:', name);

    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMoviesByName(name).subscribe({
      next: (response) => {
        console.log('✅ Antwort vom Server:', response);
        this.movies = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Fehler:', error);
        this.errorMessage = 'Fehler beim Laden der Filme.';
        this.isLoading = false;
      }
    });
  }
}
