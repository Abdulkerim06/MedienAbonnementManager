// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/movies/users'; // an dein Backend anpassen

  // Status & Username als Observables
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private username = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  isLoggedIn$ = this.loggedIn.asObservable();
  username$ = this.username.asObservable();

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string) {
    return this.http.post<{ token: string; name: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.name);
        this.loggedIn.next(true);
        this.username.next(res.name);
      })
    );
  }

  // Registrieren
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/create`, { name, email, password });
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.username.next(null);
  }

  // Hilfsfunktion
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
