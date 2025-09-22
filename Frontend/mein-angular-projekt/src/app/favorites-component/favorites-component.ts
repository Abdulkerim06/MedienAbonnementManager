// src/app/favorites/favorites.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Meine Favoriten</h2>
    <p>Hier könnten deine gespeicherten Filme angezeigt werden 🎬</p>
  `
})
export class FavoritesComponent {}
