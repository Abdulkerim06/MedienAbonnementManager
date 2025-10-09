// src/app/auth/auth.service.ts
import {Injectable, Inject, PLATFORM_ID, signal, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(false);
  username = signal<string | null>(null);
  private router = inject(Router);

  login() {
    this.isLoggedIn.set(true);
    this.username.set('Max');
    this.router.navigate(['/movies']);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.username.set(null);
    this.router.navigate(['/']);
  }
}
