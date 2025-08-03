import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject } from '@angular/core';
import { MODAL_DATA } from '../modal.token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  imports: [
    CommonModule
  ]
})
export class AlertComponent {

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private overlayRef: OverlayRef
  ) { }

  close() {
    this.data.reject?.() // garante rejeição se fechar
    this.overlayRef.dispose()
  }

  confirm() {
    this.data.resolve?.(true)
    this.overlayRef.dispose()
  }

}
