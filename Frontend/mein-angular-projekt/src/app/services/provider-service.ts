import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { BillingCycle, Provider } from '../interfaces/provider';
import { KeycloakOperationService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly apiUrl = 'http://localhost:8080/api/users/me';

  constructor(
    private readonly http: HttpClient,
    private readonly keycloak: KeycloakOperationService
  ) {}

  getProviders(): Observable<Provider[]> {
    return from(this.createAuthHeaders()).pipe(
      switchMap((headers) => this.http.get<Provider[]>(`${this.apiUrl}/providers`, { headers }))
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
      switchMap((headers) => this.http.put(`${this.apiUrl}/subscriptions`, payload, { headers }))
    );
  }

  private async createAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.keycloak.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
