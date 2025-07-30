import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

registerLocaleData(localePt);
class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach() { return false; }
  store() { }
  shouldAttach() { return false; }
  retrieve() { return null; }
  shouldReuseRoute() { return false; }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: 'reload',
    }), withInMemoryScrolling({
      scrollPositionRestoration: 'enabled'
    })), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
