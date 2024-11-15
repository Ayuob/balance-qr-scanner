import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from '../../validators/phone-number.validator';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.scss']
})
export class PhoneFormComponent {
  @Output() formSubmit = new EventEmitter<string>();
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.get('phoneNumber')?.value);
    }
  }

  reset() {
    this.form.reset();
  }
}