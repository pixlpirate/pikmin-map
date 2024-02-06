import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../services';

@Injectable( {
	providedIn: 'root'
} )
export class AppUpdateService
{
	constructor (
		private readonly updates: SwUpdate,
		private translateService: TranslateService,
		private alertService: AlertService,
	)
	{
		// Check for updates as soon as the service is instantiated by AppComponent
		this.updates.versionUpdates.subscribe( ( event: VersionEvent ) =>
		{
			if ( event.type === "VERSION_READY" ) {
				this.showAlert();
			}
		} );
	}

	/**
	 * Show an update alert to the user
	 *
	 * @returns void
	 */
	public showAlert(): void
	{
		this.alertService.set( {
			header: this.translateService.instant( 'UPDATE_AVAILABLE' ),
			message: this.translateService.instant( 'UPDATE_AVAILABLE_DETAILS' ),
			action: this.doAppUpdate,
			caller: this
		} );
	}

	/**
	 * Perform the app update by reloading the page
	 *
	 * @returns void
	 */
	public doAppUpdate(): void
	{
		this.updates.activateUpdate().then( () => document.location.reload() );
	}
}
