import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import {MovieListComponent} from './movie-list-component/movie-list-component';
import {AboutComponent} from './about-component/about-component';

export const routes: Routes = [
  { path: 'register',
    component: Register
  },
  { path: 'login',
    component: Login
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  }, // Standard: Movies
  { path: 'movies',
    component: MovieListComponent
  },
  { path: 'about',
    component: AboutComponent
  },
  { path: '**',
    redirectTo: 'movies'
  } // Fallback
];
