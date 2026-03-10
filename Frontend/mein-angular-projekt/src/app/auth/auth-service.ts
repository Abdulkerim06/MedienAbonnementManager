import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakOperationService } from '../services/keycloak.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly username = signal<string | null>(null);
  readonly isReady = signal(false);

  constructor(
    private readonly router: Router,
    private readonly keycloak: KeycloakOperationService
  ) {
    void this.refreshAuthState();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  async refreshAuthState(): Promise<void> {
    const loggedIn = this.keycloak.isLoggedIn();
    this.isAuthenticated.set(loggedIn);

    if (!loggedIn) {
      this.username.set(null);
      this.isReady.set(true);
      return;
    }

    try {
      const profile = await this.keycloak.getUserProfile();
      this.username.set(profile.firstName ?? profile.username ?? profile.email ?? null);
    } catch (error) {
      console.error('Fehler beim Laden des Benutzerprofils:', error);
      this.username.set(null);
    } finally {
      this.isReady.set(true);
    }
  }

  async login(redirectPath = '/movies'): Promise<void> {
    await this.keycloak.login({
      redirectUri: this.buildRedirectUri(redirectPath)
    });
  }

  async register(redirectPath = '/movies'): Promise<void> {
    await this.keycloak.register({
      redirectUri: this.buildRedirectUri(redirectPath)
    });
  }

  async logout(): Promise<void> {
    this.isAuthenticated.set(false);
    this.username.set(null);
    await this.keycloak.logout(this.buildRedirectUri('/'));
    await this.router.navigate(['/']);
  }

  private buildRedirectUri(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return typeof window === 'undefined'
      ? normalizedPath
      : `${window.location.origin}/#${normalizedPath}`;
  }
}
