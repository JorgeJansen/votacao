import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { AlertComponent } from '../components/dialogs/alert/alert.component';
import { MODAL_DATA } from '../components/dialogs/modal.token';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private overlay: Overlay, private injector: Injector) { }

  open(data: { title: string; message: string }, component: any = AlertComponent): Promise<any> {
    return new Promise((resolve, reject) => {
      const overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
      });

      const injector = this.createInjector({ ...data, resolve, reject }, overlayRef);
      const modalPortal = new ComponentPortal(component, null, injector);

      overlayRef.attach(modalPortal);
      overlayRef.backdropClick().subscribe(() => {
        reject(); // se clicar fora, também rejeita
        overlayRef.dispose();
      });
    });
  }

  private createInjector(data: any, overlayRef: OverlayRef): Injector {
    return Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: data },
        { provide: OverlayRef, useValue: overlayRef }
      ],
      parent: this.injector
    });
  }
}
