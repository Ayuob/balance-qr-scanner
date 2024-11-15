import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^\+?[\d\s-]{10,}$/.test(control.value);
    return valid ? null : { invalidPhone: true };
  };
}