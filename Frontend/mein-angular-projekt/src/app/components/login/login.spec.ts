import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';
import { AuthService } from '../../auth/auth-service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const authServiceStub = {
    isLoggedIn: () => false,
    username: () => null,
    login: jasmine.createSpy('login')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
