import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

const TOKEN_HEADER = 'Authorization';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.token;

    if (!token) {
      return next.handle(req);
    }
    const cloned = req.clone({
      headers: req.headers.set(TOKEN_HEADER, `Bearer ${token}`),
    });
    return next.handle(cloned);
  }
}
