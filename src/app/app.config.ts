import {
	ApplicationConfig,
	importProvidersFrom,
	isDevMode,
} from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { translateLoaderFactory } from './factories/translate-loader-factory';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(),
		provideRouter(routes),
		provideAnimations(),
		provideMarkdown(),
		importProvidersFrom(
			TranslateModule.forRoot({
				defaultLanguage: 'en',
				loader: {
					provide: TranslateLoader,
					useFactory: translateLoaderFactory,
					deps: [HttpClient],
				},
			})
		),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
};
