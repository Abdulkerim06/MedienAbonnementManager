import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { MovieListComponent } from './components/movie-list-component/movie-list-component';
import {Login} from './components/login/login';
import {RegisterComponent} from './components/register/register';
import {NavbarComponent} from './components/navbar-component/navbar-component';
import {KeycloakAngularModule} from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, KeycloakAngularModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('mein-angular-projekt');
}
