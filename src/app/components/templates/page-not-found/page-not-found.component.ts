import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * The page not found component used to display a 404 error.
 */
@Component( {
	selector: 'app-page-not-found',
	standalone: true,
	imports: [ CommonModule, RouterLink, TranslateModule ],
	templateUrl: './page-not-found.component.html',
	styleUrl: './page-not-found.component.scss'
} )
export class PageNotFoundComponent implements OnInit, OnDestroy
{
	public currentLanguage: string = 'en';
	private languageSubscription?: Subscription;

	constructor (
		private translateService: TranslateService
	) { }

	/* Angular Lifecycle
	--------------------------------------------- */
	public ngOnInit()
	{
		this.currentLanguage = this.translateService.currentLang;
		this.languageSubscription = this.translateService.onLangChange.subscribe( ( event ) =>
		{
			this.currentLanguage = event.lang;
		} );
	}

	public ngOnDestroy()
	{
		this.languageSubscription?.unsubscribe();
	}
}
