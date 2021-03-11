import { AbstractControl } from '@angular/forms';

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getControlMessage(control: AbstractControl): string | undefined {
  const errors = control.errors;
  if (!errors) {
    return undefined;
  }
  if (errors['required']) {
    return `This field is required`;
  }

  if (errors['email']) {
    return `This field must be a correct email address`;
  }

  if (errors['minlength']) {
    return `This field must be at least ${errors['minlength'].requiredLength} characters long`;
  }

  const keys = Object.keys(errors);
  const err = keys.map((key) => errors[key]);
  return err[0];
}
