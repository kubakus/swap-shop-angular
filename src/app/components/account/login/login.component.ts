import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/app/shared/models/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  private accountService: AuthService;
  private router: Router;
  private route: ActivatedRoute;

  public constructor(
    accountService: AuthService,
    router: Router,
    route: ActivatedRoute
    ) {
    this.accountService = accountService;
    this.router = router;
    this.route = route;

    this.form = new FormGroup({
      email: new FormControl(undefined, Validators.required),
      password: new FormControl(undefined, Validators.required),
    })
   }

  public ngOnInit(): void {
  }

  public onSubmit(): void {
    const loginDetails: Users.LoginDetails = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.accountService.login(loginDetails).pipe(take(1)).subscribe(
      () => {
        this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/'])
      },
      (err) => {
        console.error("Failed to login")
      }
    )
  }

}
