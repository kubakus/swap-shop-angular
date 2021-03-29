import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router: Router;
  private authService: AuthService;

  public constructor(router: Router, authService: AuthService) {
    this.router = router;
    this.authService = authService;
  }

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn.pipe(
      map((res) => {
        const loginPath = this.router.parseUrl('/account/login');
        return res || loginPath;
      }),
    );
  }
}
