import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorCode } from 'src/app/shared/error-codes';
import { Alerts } from 'src/app/shared/models/alerts';
import { Users } from 'src/app/shared/models/users';

const CREDENTIALS_INCORRECT_ERROR_MESSAGE = 'Credentials incorrect';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public form: FormGroup;

  private authService: AuthService;
  private alertService: AlertService;

  private router: Router;
  private route: ActivatedRoute;

  public constructor(
    authService: AuthService,
    alertService: AlertService,
    router: Router,
    route: ActivatedRoute,
  ) {
    this.authService = authService;
    this.alertService = alertService;

    this.router = router;
    this.route = route;

    this.form = new FormGroup({
      email: new FormControl(undefined, Validators.required),
      password: new FormControl(undefined, Validators.required),
    });
  }

  public onSubmit(): void {
    const loginDetails: Users.LoginDetails = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService
      .login(loginDetails)
      .pipe(take(1))
      .subscribe(
        () => {
          this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/']);
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to login', err);
          if (err.status === ErrorCode.BadRequest) {
            if (err.error.message.startsWith(CREDENTIALS_INCORRECT_ERROR_MESSAGE)) {
              this.alertService.show({
                type: 'error',
                message: 'Either email address or password is incorrect. Please, try again.',
                autoClose: Alerts.AlertLength.Long,
              });
            }
          }
        },
      );
  }
}
