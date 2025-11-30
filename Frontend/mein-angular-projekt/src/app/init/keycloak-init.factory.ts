import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8081', // Keycloak URL
        realm: 'angular-realm',
        clientId: 'angular-client',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      // WICHTIG: Diese Parameter herausnehmen:
       enableBearerInterceptor: true,
       bearerPrefix: 'Bearer ',
       bearerExcludedUrls: ['/assets', '/public']
    });
}
