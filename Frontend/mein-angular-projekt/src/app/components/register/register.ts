// src/app/auth/register.component.ts
import {ChangeDetectionStrategy, Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  /*template: `
    <h2>Registrieren</h2>
    <form (ngSubmit)="onRegister()">
      <label>Name:
        <input type="text" [(ngModel)]="name" name="name" required />
      </label>
      <br />
      <label>Email:
        <input type="email" [(ngModel)]="email" name="email" required />
      </label>
      <br />
      <label>Passwort:
        <input type="password" [(ngModel)]="password" name="password" required />
      </label>
      <br />
      <button type="submit">Registrieren</button>
    </form>

    <p *ngIf="success" style="color:green">{{ success }}</p>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `*/
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {



  /*name = '';
  email = '';
  password = '';
  success = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.success = 'Registrierung erfolgreich! Bitte einloggen.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => this.error = 'Registrierung fehlgeschlagen'
    });
  }*/
}
