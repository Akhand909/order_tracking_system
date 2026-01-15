import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // Check if token is valid
      return this.authService.validateToken().pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          this.authService.logout();
          this.router.navigate(['/admin/login']);
          return of(false);
        })
      );
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}