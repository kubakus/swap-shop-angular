import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Roles } from '../shared/models/roles';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService: AuthService;
  private router: Router;

  private constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const canAccessObs = this.authService.hasRole(Roles.Type.ADMIN);
    const homePath = this.router.parseUrl('/');
    return canAccessObs.pipe(map((canAccess) => canAccess || homePath));
  }
}
