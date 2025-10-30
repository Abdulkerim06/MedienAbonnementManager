import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    // Prüfen, ob wir im Browser sind
    if (typeof window === 'undefined') {
      console.warn('Keycloak init skipped (Server-Side Rendering)');
      return;
    }

    await keycloak.init({
      config: {
        url: 'http://localhost:8081', // Keycloak URL
        realm: 'angular-realm',
        clientId: 'angular-client',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      loadUserProfileAtStartUp: true,
    });
  };
}
