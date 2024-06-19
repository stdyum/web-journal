import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { TranslationService, withDefaultInterceptors } from '@likdan/studyum-core';
import { provideGetErrorMessageFunc } from '@likdan/form-builder-material/errors';
import { provideNativeDateAdapter } from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideGetErrorMessageFunc(key => inject(TranslationService).getTranslation(`controls_errors_${key}`)()),
    provideHttpClient(withDefaultInterceptors()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideAnimations(),
  ],
};
