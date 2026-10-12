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
const financeFields = {
  background: 'var(--ui-surface-alt)', color: 'var(--ui-text)',
  borderColor: 'var(--ui-border)', hoverBorderColor: 'var(--ui-accent)', focusBorderColor: 'var(--ui-accent)',
  placeholderColor: 'var(--ui-muted)',
};
const FinanceTheme = definePreset(Aura, {
  semantic: {
    primary: { 50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}', 300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}', 600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}', 900: '{emerald.900}', 950: '{emerald.950}' },
    colorScheme: { light: { formField: financeFields }, dark: { formField: financeFields } },
  },
  components: {
    card: {
      root: { background: 'var(--ui-surface)', color: 'var(--ui-text)', borderRadius: '15px', shadow: 'none' },
      body: { padding: '24px' },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'it-IT' },
    providePrimeNG({
      theme: { preset: FinanceTheme, options: { darkModeSelector: '[data-theme="dark"]', cssLayer: false } },
      translation: {
        dayNames: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
        monthNames: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
        monthNamesShort: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
        firstDayOfWeek: 1, dateFormat: 'dd/mm/yy', today: 'Oggi', clear: 'Cancella',
        chooseDate: 'Scegli una data', chooseMonth: 'Scegli il mese', chooseYear: 'Scegli l’anno',
        prevMonth: 'Mese precedente', nextMonth: 'Mese successivo', prevYear: 'Anno precedente', nextYear: 'Anno successivo',
        emptyMessage: 'Nessun risultato', emptyFilterMessage: 'Nessun risultato',
        searchMessage: '{0} risultati disponibili', emptySearchMessage: 'Nessun risultato disponibile',
        selectionMessage: '{0} elementi selezionati', emptySelectionMessage: 'Nessun elemento selezionato',
        accept: 'Conferma', reject: 'Annulla', choose: 'Scegli', cancel: 'Annulla',
      },
    }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
