import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';

import { LanguagePickerComponent } from '../../organisms/language-picker/language-picker.component';
import { Subscription } from 'rxjs';

/**
 * The about page component used to display information about the project.
 */
@Component( {
	selector: 'app-page-about',
	standalone: true,
	imports: [ CommonModule, LanguagePickerComponent, MarkdownComponent, RouterLink ],
	templateUrl: './page-about.component.html',
	styleUrl: './page-about.component.scss'
} )
export class PageAboutComponent implements OnInit, OnDestroy
{
	public currentLanguage: string = 'en';
	private languageSubscription?: Subscription;

	public aboutLoaded: boolean = false;
	public faqLoaded: boolean = false;
	public changelogLoaded: boolean = false;

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
			this.aboutLoaded = false;
			this.faqLoaded = false;
			this.changelogLoaded = false;
		} );
	}

	public ngOnDestroy()
	{
		this.languageSubscription?.unsubscribe();
	}

	/* Markdown
	--------------------------------------------- */
	public onMarkdownLoad( event: string )
	{
		console.log( 'Markdown loaded', event );
	}

	/* Translation
	--------------------------------------------- */
	/**
	 * Translate a key
	 *
	 * @param {string} key - The key to translate
	 *
	 * @returns {string} - The plain text translation associated with the key
	 */
	public translate( key: string ): string
	{
		return this.translateService.instant( key );
	}
}
