// src/app/components/movie-list/movie-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- wichtig für *ngIf, *ngFor, Pipes
import { MovieService } from '../movie-service';
import { Film } from '../film';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-movie-list-component',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './movie-list-component.html',
  styleUrl: './movie-list-component.css'
})
export class MovieListComponent implements OnInit {
  movies: Film[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.searchMovies('transformers'); // Beispielaufruf
  }

  searchMovies(name: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.movieService.getMoviesByName(name).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Fehler beim Laden der Filme.';
        this.isLoading = false;
      }
    });
  }
}
