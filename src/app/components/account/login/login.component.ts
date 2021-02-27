import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  public constructor(accountService: AuthService) {
    this.accountService = accountService;

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

    this.accountService.login(loginDetails).subscribe(res => {
      console.log("login successful", res)
    })
  }

}
