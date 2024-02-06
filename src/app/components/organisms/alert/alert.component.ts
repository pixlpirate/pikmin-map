import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../../services';
import { ClickOutsideDirective } from '../../../directives';

/**
 * The alert popup used to display messages to the user (e.g. update warnings).
 */
@Component( {
	selector: 'app-alert',
	standalone: true,
	imports: [ CommonModule, ClickOutsideDirective ],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss'
} )
export class AlertComponent implements OnInit, OnDestroy
{
	@Input() header?: string;
	@Input() message?: string;
	@Input() action?: Function;
	@Input() caller?: any;

	public isVisible = false;

	private alertSubscription?: Subscription;

	constructor (
		private alertService: AlertService,
		private translateService: TranslateService
	) { }

	/* Angular lifecycle
	----------------------------------------- */
	public ngOnInit()
	{
		this.alertService.listen().subscribe( alert =>
		{
			this.header = alert.header;
			this.message = alert.message;
			this.action = alert.action;
			this.caller = alert.caller;

			this.isVisible = true;
		} );
	}

	public ngOnDestroy()
	{
		this.alertSubscription?.unsubscribe();
	}

	/* Alert
	----------------------------------------- */
	public doAction()
	{
		if ( this.action ) {
			this.action.call( this.caller );
		}
	}

	public close()
	{
		this.isVisible = false;
	}

	/* Translation
	----------------------------------------- */
	public translate( key: string )
	{
		return this.translateService.instant( key );
	}
}
