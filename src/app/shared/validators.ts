import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  public static confirmPasswords(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: 'Passwords must be the same' };
  }
}
