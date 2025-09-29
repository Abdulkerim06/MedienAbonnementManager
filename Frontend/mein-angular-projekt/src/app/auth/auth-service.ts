// src/app/auth/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/movies/users'; // an dein Backend anpassen
  private isBrowser: boolean;

  private loggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.loggedIn.asObservable();
  username$ = this.username.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loggedIn.next(this.hasToken());
      this.username.next(localStorage.getItem('username'));
    }
  }

  // Login
  login(email: string, password: string) {
    return this.http.post<{ token: string; name: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap((res) => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.name);
        }
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
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    this.loggedIn.next(false);
    this.username.next(null);
  }

  // Hilfsfunktion
  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
