import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/app/shared/models/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;

  private accountService: AuthService;

  public constructor(accountService: AuthService) { 
    this.accountService = accountService;

    this.form = new FormGroup({
      name: new FormControl(undefined, Validators.required),
      email: new FormControl(undefined, [Validators.required, Validators.email]),
      password: new FormControl(undefined, Validators.required),
      confirmPassword: new FormControl(undefined, Validators.required),
    })
  }

  public ngOnInit(): void {
  }

  public onSubmit() {
    const userRequest: Users.CreateUserRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.accountService.register(userRequest).subscribe((res) => {
      console.log("created", res)
    })
  }

}
