import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STORAGE } from './auth.service';

const TOKEN_HEADER = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = STORAGE.getItem('token');
    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      headers: req.headers.set(TOKEN_HEADER, token),
    });
    return next.handle(cloned);
  }
}
