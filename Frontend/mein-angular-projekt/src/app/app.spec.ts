import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './auth/auth-service';

describe('App', () => {
  const authServiceStub = {
    isLoggedIn: () => false,
    username: () => null,
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the main layout', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar-component')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
