import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainPage} from './main-page/main-page';
import {MovieListComponent} from './movie-list-component/movie-list-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainPage, MovieListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mein-angular-projekt');
}
