// src/app/navbar/navbar.component.ts
import {Component, Input} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
