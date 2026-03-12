import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { buildKeycloakRedirectUri, rememberPostAuthRedirect } from './auth-redirect';

async function isAccessAllowed(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> {
  if (!authData.authenticated) {
    rememberPostAuthRedirect(state.url);
    await authData.keycloak.login({
      redirectUri: buildKeycloakRedirectUri()
    });

    return false;
  }

  const requiredRoles = route.data['roles'];
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    return true;
  }

  const grantedRoles = [
    ...authData.grantedRoles.realmRoles,
    ...Object.values(authData.grantedRoles.resourceRoles).flat()
  ];

  const hasAllRequiredRoles = requiredRoles.every((role: string) => grantedRoles.includes(role));
  return hasAllRequiredRoles ? true : inject(Router).parseUrl('/');
}

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
