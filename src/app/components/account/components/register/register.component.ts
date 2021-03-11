import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorCode } from 'src/app/shared/error-codes';
import { CustomErrorStateMatcher } from 'src/app/shared/form-error-matcher';
import { getControlMessage } from 'src/app/shared/helpers';
import { Users } from 'src/app/shared/models/users';
import { CustomValidators } from 'src/app/shared/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup;
  public errorStateMatcher: ErrorStateMatcher;

  private authService: AuthService;
  private alertService: AlertService;

  public constructor(authService: AuthService, alertService: AlertService) {
    this.authService = authService;
    this.alertService = alertService;

    this.form = new FormGroup(
      {
        name: new FormControl(undefined, Validators.required),
        email: new FormControl(undefined, [Validators.required, Validators.email]),
        password: new FormControl(
          undefined,
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ),
        confirmPassword: new FormControl(undefined, Validators.required),
      },
      { validators: CustomValidators.confirmPasswords },
    );
    this.errorStateMatcher = new CustomErrorStateMatcher();
  }

  public onSubmit(): void {
    const userRequest: Users.CreateRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.authService
      .register(userRequest)
      .pipe(take(1))
      .subscribe(
        (_res) => {
          this.alertService.show({
            type: 'success',
            message:
              'Your account has been created successfully. Please check your email address to finish the registration process.',
          });
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to register new a account', err);
          if (err.status === ErrorCode.Conflict) {
            this.alertService.show({
              type: 'error',
              message:
                'Ops, it seems this email already exists in the system. Did you want to login instead?',
            });
          }
        },
      );
  }

  public getControlError(control: AbstractControl): string | undefined {
    return getControlMessage(control);
  }
}
