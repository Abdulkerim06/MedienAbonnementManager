import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { BillingCycle, Provider } from '../interfaces/provider';
import { KeycloakOperationService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly userApiUrl = 'http://localhost:8080/api/users/me';
  private readonly providerApiUrl = 'http://localhost:8080/api/providers';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakOperationService
  ) {}

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Array<Partial<Provider>>>(this.providerApiUrl).pipe(
      map((providers) => providers.map((provider) => this.toProvider(provider)))
    );
  }

  getUserProviders(): Observable<Provider[]> {
    return from(this.createAuthHeaders()).pipe(
      switchMap((headers) => this.http.get<Provider[]>(`${this.userApiUrl}/providers`, { headers }))
    );
  }

  updateSubscriptions(providers: Provider[]): Observable<unknown> {
    const payload = providers
      .filter((provider) => provider.ownedByUser)
      .map((provider) => ({
        providerId: provider.tmdbProviderId,
        billingCycle: (provider.billingCycle ?? 'MONTHLY') as BillingCycle,
        lastBillingDate: provider.lastBillingDate
      }));

    return from(this.createAuthHeaders()).pipe(
      switchMap((headers) => this.http.put(`${this.userApiUrl}/subscriptions`, payload, { headers }))
    );
  }

  private toProvider(provider: Partial<Provider>): Provider {
    return {
      id: provider.id ?? 0,
      tmdbProviderId: provider.tmdbProviderId ?? 0,
      providerName: provider.providerName ?? '',
      logoPath: provider.logoPath ?? '',
      ownedByUser: provider.ownedByUser ?? false,
      billingCycle: provider.billingCycle ?? null,
      lastBillingDate: provider.lastBillingDate ?? null
    };
  }

  private async createAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.keycloak.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
