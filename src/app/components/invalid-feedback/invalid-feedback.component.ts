import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-invalid-feedback',
  templateUrl: './invalid-feedback.component.html',
  styleUrls: ['./invalid-feedback.component.scss'],
  imports: []
})
export class InvalidFeedbackComponent {

  @Input() field?: any;
  @Input() name = 'Field'
  msgError: string = ''

  constructor(private renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'invalid-feedback')
  }

  isError(field: FormControl): any {
    if (field) {
      this.msgError = ''
      if (field.touched && field.errors?.['required']) {
        this.msgError = 'Necessary field.'
      } else if (field.errors?.['invalidDate'] || field.errors?.['bsDate']) {
        this.msgError = 'Invalid date.'
      } else if (field.errors?.['pattern']) {
        this.msgError = `${this.name} invalid.`
      } else if (field.errors?.['invalid']) {
        this.msgError = `${this.name} invalid.`
      } else if (field.errors?.['Mask error'] || field.errors?.['mask']) {
        this.msgError = `${this.name} invalid.`
      } else if (field.errors?.['min']) {
        this.msgError = `Minimum value ${field.errors?.['min']?.min}.`
      } else if (field.errors?.['max']) {
        this.msgError = `Maximum value ${field.errors?.['max'].max}.`
      } else if (field.errors?.['doNotMatch']) {
        this.msgError = `Passwords not matching.`
      } else if (field.errors?.['minlength']) {
        this.msgError = `Minimum of ${field.errors?.['minlength'].requiredLength} characters`
      } else if (field.errors?.['maxlength']) {
        this.msgError = `Max of ${field.errors?.['maxlength'].requiredLength} characters`
      }
      return this.msgError != ''
    }
  }

}
