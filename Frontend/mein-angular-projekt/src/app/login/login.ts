// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onLogin()">
      <label>Email:
        <input type="email" [(ngModel)]="email" name="email" required />
      </label>
      <br />
      <label>Passwort:
        <input type="password" [(ngModel)]="password" name="password" required />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>

    <p *ngIf="error" style="color:red">{{ error }}</p>
  `
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: () => this.error = 'Login fehlgeschlagen'
    });
  }
}
