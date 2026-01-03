import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../interfaces/movie-response';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/movies';

  constructor(private http: HttpClient) {}

  getMoviesByName(name: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/name/${name}`);
  }
}
