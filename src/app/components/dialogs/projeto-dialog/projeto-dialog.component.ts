import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { valueOrDefault } from '../../../commons/usefullFunctions';
import { InvalidFeedbackComponent } from '../../invalid-feedback/invalid-feedback.component';
import { MODAL_DATA } from '../modal.token';

@Component({
  selector: 'app-projeto-dialog',
  templateUrl: './projeto-dialog.component.html',
  imports: [
    CommonModule,
    InvalidFeedbackComponent,
    ReactiveFormsModule
  ]
})
export class ProjetoDialogComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private formBuilder: FormBuilder,
    private overlayRef: OverlayRef
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      foto: this.data?.edit?.foto,
      numProjeto: [this.data?.edit?.numProjeto, Validators.required],
      nomProjeto: [this.data?.edit?.nomProjeto, Validators.required],
      desProjeto: [this.data?.edit?.desProjeto, Validators.required],
      pdf: this.data?.edit?.pdf,
      flgVotacaoProj: valueOrDefault(this.data?.edit?.flgVotacaoProj, false),
      dtaVotacao: [this.data?.edit?.dtaVotacao ? moment(this.data?.edit?.dtaVotacao, 'DD/MM/YYY').format('YYYY-MM-DD') : '', Validators.required],
      abstencao: 0,
      sim: 0,
      nao: 0,
      codMunicipio: 310059
    })
  }

  close() {
    this.data.reject?.() // garante rejeição se fechar
    this.overlayRef.dispose()
  }

  confirm() {
    if (this.formGroup.valid) {
      const body = this.formGroup.value
      body.dtaVotacao = moment(body.dtaVotacao, 'YYYY-MM-DD').format('DD/MM/YYYY')
      this.data.resolve?.(body)
      this.overlayRef.dispose()
    } else {
      this.formGroup.markAllAsTouched()
    }
  }

  get f() {
    return this.formGroup.controls
  }
}
