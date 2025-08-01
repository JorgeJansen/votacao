import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private configSignal = signal<any>(null)

  setConfig(config: any) {
    this.configSignal.set(config)
  }

  getConfig() {
    return this.configSignal()
  }

}