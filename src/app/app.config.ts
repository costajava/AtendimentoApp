import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { 
    MAT_DATE_LOCALE, 
    MAT_DATE_FORMATS,
    DateAdapter
} from '@angular/material/core';
import { routes } from './app.routes';
import { MatPaginatorIntlPtBr } from './core/mat-paginator-intl-pt-br';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { PtBrDateAdapter } from './core/pt-br-date-adapter'; 

registerLocaleData(localePt, 'pt-BR');

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy', 
  },
  display: {
    dateInput: 'input', 
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    
    { provide: DateAdapter, useClass: PtBrDateAdapter },

    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr }
  ]
};