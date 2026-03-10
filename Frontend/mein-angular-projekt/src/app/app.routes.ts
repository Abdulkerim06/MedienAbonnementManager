import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register';
import { Login } from './components/login/login';
import {MovieListComponent} from './components/movie-list-component/movie-list-component';
import {MovieDetailComponent} from './components/movie-detail-component/movie-detail-component';
import {AboutComponent} from './components/about-component/about-component';
import {MainPage} from './components/main-page/main-page';
import {FavoritesComponent} from './components/favorites-component/favorites-component';
import {authGuard} from './auth/auth.guard';
import {ProvidersComponent} from './components/providers/providers';

export const routes: Routes = [
  { path: '', component:  MainPage},
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'providers', component: ProvidersComponent},
  { path: 'about', component: AboutComponent },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to home
];
