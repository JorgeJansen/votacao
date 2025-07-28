import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // Métodos estáticos protegidos
  private static get isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static clear() {
    if (this.isBrowser) sessionStorage.clear();
  }

  // Storage Tools
  static save(key: string, value: any): boolean {
    if (!this.isBrowser) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_err) {
      console.log('StorageService.save', _err)
      return false;
    }
    return true;
  }

  static get(key: string): any {
    if (!this.isBrowser) return null;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('StorageService.get', error);
      return null;
    }
  }

  static delete(key: string): boolean {
    if (!this.isBrowser) return false;

    sessionStorage.removeItem(key);
    return true;
  }

  static client_jwt(): string {
    return this.get('client_jwt');
  }

  static manager_uuid(): string {
    return this.get('manager_uuid');
  }

  static is_manager(): boolean {
    return this.get('is_manager');
  }

  static partner_uuid(): string {
    return this.get('partner_uuid');
  }

  // LOCAL STORAGE
  static clearLocal(): void {
    if (this.isBrowser) localStorage.clear();
  }

  static saveLocal(key: string, value: any): boolean {
    if (!this.isBrowser) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('StorageService.saveLocal', error);
      return false;
    }
  }

  static getLocal(key: string): any {
    if (!this.isBrowser) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('StorageService.getLocal', error);
      return null;
    }
  }

  static deleteLocal(key: string): boolean {
    if (!this.isBrowser) return false;

    localStorage.removeItem(key);
    return true;
  }
}