// src/app/about/about.component.ts
import {ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="bg-gray-800 p-8 rounded-xl shadow-2xl animate-fade-in">
       <h1 class="text-3xl font-bold text-cyan-400">Über uns</h1>
       <p class="mt-4 text-gray-300">Dies ist eine Demo-Anwendung, um die Verwaltung von Medien-Abonnements zu zeigen.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AboutComponent {}
