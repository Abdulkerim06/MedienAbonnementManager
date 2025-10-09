import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { Login } from './login/login';
import {MovieListComponent} from './movie-list-component/movie-list-component';
import {AboutComponent} from './about-component/about-component';
import {MainPage} from './main-page/main-page';
import {FavoritesComponent} from './favorites-component/favorites-component';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component:  MainPage},
  { path: 'movies', component: MovieListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to home
];
