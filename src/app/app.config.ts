import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './features/auth/services/auth.interceptor';

registerLocaleData(localeIt);
const FinanceTheme = definePreset(Aura, {
  semantic: {
    primary: { 50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}', 300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}', 600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}', 900: '{emerald.900}', 950: '{emerald.950}' },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'it-IT' },
    providePrimeNG({ theme: { preset: FinanceTheme, options: { darkModeSelector: '[data-theme="dark"]', cssLayer: false } } }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
