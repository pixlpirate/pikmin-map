import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AlertComponent, ToastContainerComponent } from '../../../components';
import { AppUpdateService, LocalStorageService } from '../../../services';

/**
 * The main app component. Displayed components are handled by the router outlet.
 * It also contains containers for the alert and toast components as a placeholder.
 */
@Component( {
	selector: 'app-root',
	standalone: true,
	imports: [ AlertComponent, CommonModule, ToastContainerComponent, TranslateModule, RouterOutlet ],
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
} )
export class AppComponent
{
	title = 'Pikmin Bloom Decor Map';

	constructor (
		private translateService: TranslateService,
		private localStorageService: LocalStorageService,
		private updateService: AppUpdateService
	)
	{
		/* Language
		----------------------------------------- */
		const browserLanguage = this.localStorageService.getItem('locale') || navigator.language || 'en';
		const languageCode = browserLanguage.split( '-' )[ 0 ];
		this.translateService.setDefaultLang( languageCode );
		this.translateService.use( languageCode );
		this.translateService.addLangs( [ 'en', 'fr', 'de', 'it', 'es', 'pt' ] );

		/* Local storage
		----------------------------------------- */
		this.localStorageService.setItem( 'locale', languageCode );
		this.translateService.onLangChange.subscribe( ( { lang } ) =>
		{
			this.localStorageService.setItem( 'locale', lang );
		} );
	}
}
