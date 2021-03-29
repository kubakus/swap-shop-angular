import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  public isLoggedIn: Observable<boolean>;

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  public logout(): void {
    this.authService.logout();
  }
}
