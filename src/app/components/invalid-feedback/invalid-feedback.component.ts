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
  @Input() name = 'Campo'
  msgError: string = ''

  constructor(private renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'invalid-feedback')
  }

  isError(field: FormControl): any {
    if (field) {
      this.msgError = ''
      if (field.touched && field.errors?.['required']) {
        this.msgError = `${this.name} obrigatório.`
      } else if (field.errors?.['invalidDate'] || field.errors?.['bsDate']) {
        this.msgError = 'Data inválida.'
      } else if (field.errors?.['pattern']) {
        this.msgError = `${this.name} inválido(a).`
      } else if (field.errors?.['invalid']) {
        this.msgError = `${this.name} inválido(a).`
      } else if (field.errors?.['Mask error'] || field.errors?.['mask']) {
        this.msgError = `${this.name} inválido(a).`
      } else if (field.errors?.['min']) {
        this.msgError = `Valor mínimo ${field.errors?.['min']?.min}.`
      } else if (field.errors?.['max']) {
        this.msgError = `Valor máximo ${field.errors?.['max'].max}.`
      } else if (field.errors?.['doNotMatch']) {
        this.msgError = `Senhas não coincidentes.`
      } else if (field.errors?.['minlength']) {
        this.msgError = `Mínimo de ${field.errors?.['minlength'].requiredLength} caracteres`
      } else if (field.errors?.['maxlength']) {
        this.msgError = `Máximo de ${field.errors?.['maxlength'].requiredLength} caracteres`
      }
      return this.msgError != ''
    }
  }

}
