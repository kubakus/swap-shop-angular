import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private router: Router;
    private authService: AuthService;

    public constructor(router: Router, authService: AuthService) {
        this.router = router;
        this.authService = authService;
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isLoggedIn = this.authService.isLoggedIn();
        if (isLoggedIn) {
            return true
        }
        this.router.navigate(['/account/login',])
        return false
    }
}
