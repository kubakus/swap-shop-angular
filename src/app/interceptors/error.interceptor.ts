import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ErrorCode } from '../shared/error-codes';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Alerts } from '../shared/models/alerts';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router: Router;
  private authService: AuthService;
  private alertService: AlertService;

  public constructor(router: Router, authService: AuthService, alertService: AlertService) {
    this.router = router;
    this.authService = authService;
    this.alertService = alertService;
  }

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (this.authService.token) {
          switch (err.status) {
            case ErrorCode.Unauthorized:
              this.alertService.show({
                type: 'info',
                message: 'There was a problem with your authentication. Please login again.',
                autoClose: Alerts.AlertLength.Normal,
              });
              this.authService.logout();
              break;
            case ErrorCode.BadGateway:
              this.alertService.show({
                type: 'error',
                message: 'It seems server is unavailable at the moment. Please try again later.',
                autoClose: Alerts.AlertLength.Long,
              });
              break;
            case ErrorCode.InternalServerError:
              this.alertService.show({
                type: 'error',
                message: 'Unknown error occurred server-side. Please contact support.',
                autoClose: Alerts.AlertLength.Long,
              });
              break;
            default:
          }
        }

        return throwError(err);
      }),
    );
  }
}
