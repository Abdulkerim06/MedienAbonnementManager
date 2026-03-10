import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakOperationService {
  constructor(private readonly keycloak: Keycloak) {}

  isLoggedIn(): boolean {
    return this.keycloak.authenticated;
  }

  login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
    return this.keycloak.login(options);
  }

  register(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
    return this.keycloak.register(options);
  }

  logout(redirectUri?: string): Promise<void> {
    return this.keycloak.logout(
      redirectUri
        ? { redirectUri }
        : undefined
    );
  }

  getUserProfile(): Promise<Keycloak.KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  async getToken(minValidity = 30): Promise<string | null> {
    if (!this.keycloak.authenticated) {
      return null;
    }

    try {
      await this.keycloak.updateToken(minValidity);
    } catch {
      return this.keycloak.token ?? null;
    }

    return this.keycloak.token ?? null;
  }

  hasRealmRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }
}
