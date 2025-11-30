// src/app/auth/auth.guard.ts
import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth-service';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';


@Injectable({
  providedIn: 'root',
})

export class AuthGuard extends KeycloakAuthGuard {

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }
  // Force the user to log in if currently unauthenticated.
  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if(!this.authenticated){
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    //Get the roles required from the route.
    const requiredRoles = route.data['roles'];
    //Allow the user to proceed if no additional roles are required to access to route.
    if(!Array.isArray(requiredRoles) && requiredRoles.length === 0){
      return true;
    }
    // Allow the user to proceed if all the required roles are present
    return requiredRoles.every((role:any) => {this.roles.includes(role)});
  }
}



/*export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/login');
};*/
