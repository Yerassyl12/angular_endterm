import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:icao24', component: ProductDetailsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
