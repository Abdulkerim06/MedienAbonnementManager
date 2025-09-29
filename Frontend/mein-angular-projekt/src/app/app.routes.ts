import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { Login } from './login/login';
import {MovieListComponent} from './movie-list-component/movie-list-component';
import {AboutComponent} from './about-component/about-component';
import {MainPage} from './main-page/main-page';

export const routes: Routes = [
  {
    path:'main-page',
    component: MainPage,
  },
  {
    path: '',
    redirectTo: '/main-page',
    pathMatch: 'full'
  },
  { path: 'register',
    component: RegisterComponent
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
