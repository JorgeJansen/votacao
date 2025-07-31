import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { valueOrDefault } from '../../../commons/usefullFunctions';
import { InvalidFeedbackComponent } from '../../invalid-feedback/invalid-feedback.component';
import { MODAL_DATA } from '../modal.token';

@Component({
  selector: 'app-vereador-dialog',
  templateUrl: './vereador-dialog.component.html',
  imports: [
    CommonModule,
    InvalidFeedbackComponent,
    ReactiveFormsModule
  ]
})
export class VereadorDialogComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private formBuilder: FormBuilder,
    private overlayRef: OverlayRef
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      foto: this.data?.edit?.foto,
      nomVereador: [this.data?.edit?.nomVereador, Validators.required],
      sglPartido: this.data?.edit?.sglPartido,
      indPresidente: valueOrDefault(this.data?.edit?.indPresidente, false)
    })
  }

  close() {
    this.data.reject?.() // garante rejeição se fechar
    this.overlayRef.dispose()
  }

  confirm() {
    if (this.formGroup.valid) {
      this.data.resolve?.(this.formGroup.value)
      this.overlayRef.dispose()
    } else {
      this.formGroup.markAllAsTouched()
    }
  }

  get f() {
    return this.formGroup.controls
  }
}
