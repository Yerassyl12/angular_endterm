import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthState } from '../items/states/auth.state';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthState);
  const router = inject(Router);

  return authState.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
