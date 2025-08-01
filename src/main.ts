import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment as env } from './environments/environment';

async function loadAppBeforeBootstrap() {
  const response = await fetch(`assets/config/app.config.json?v=${env.version}`)
  const config = await response.json();

  // Salvar em window/globalThis para acessar depois
  (globalThis as any).appConfig = config;
}

loadAppBeforeBootstrap().then(() => {
  bootstrapApplication(App, {
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      ...appConfig.providers,
    ],
  });
}).catch((err) => console.error(err))