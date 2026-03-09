import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth-service';
import { KeycloakOperationService } from '../services/keycloak.service';

describe('AuthService', () => {
  let service: AuthService;
  const keycloakOperationsStub = {
    isLoggedIn: () => false,
    getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(Promise.resolve({})),
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: KeycloakOperationService, useValue: keycloakOperationsStub }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
