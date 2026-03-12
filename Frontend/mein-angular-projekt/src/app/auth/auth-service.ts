import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakOperationService } from '../services/keycloak.service';
import {
  buildKeycloakRedirectUri,
  consumePostAuthRedirect,
  isAuthCallbackPath,
  rememberPostAuthRedirect
} from './auth-redirect';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly username = signal<string | null>(null);
  readonly isReady = signal(false);
  private hasHandledPostAuthRedirect = false;

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
      await this.restorePostAuthRedirect();
      this.isReady.set(true);
    }
  }

  async login(redirectPath = '/movies'): Promise<void> {
    rememberPostAuthRedirect(redirectPath);
    await this.keycloak.login({
      redirectUri: buildKeycloakRedirectUri()
    });
  }

  async register(redirectPath = '/movies'): Promise<void> {
    rememberPostAuthRedirect(redirectPath);
    await this.keycloak.register({
      redirectUri: buildKeycloakRedirectUri()
    });
  }

  async logout(): Promise<void> {
    this.isAuthenticated.set(false);
    this.username.set(null);
    await this.keycloak.logout(typeof window === 'undefined' ? '/' : window.location.origin);
    await this.router.navigate(['/']);
  }

  private async restorePostAuthRedirect(): Promise<void> {
    if (this.hasHandledPostAuthRedirect || !this.isAuthenticated()) {
      return;
    }

    this.hasHandledPostAuthRedirect = true;
    const redirectPath = consumePostAuthRedirect();
    if (redirectPath) {
      await this.router.navigateByUrl(redirectPath);
      return;
    }

    if (isAuthCallbackPath()) {
      await this.router.navigate(['/']);
    }
  }
}
