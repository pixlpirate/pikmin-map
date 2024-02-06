import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../../services';
import { ClickOutsideDirective } from '../../../directives';

/**
 * The language picker component used to display a dropdown of available languages.
 */
@Component( {
	selector: 'app-language-picker',
	standalone: true,
	imports: [ CommonModule, ClickOutsideDirective ],
	templateUrl: './language-picker.component.html',
	styleUrl: './language-picker.component.scss'
} )
export class LanguagePickerComponent
{
	public isOpen: boolean = false;
	public currentLanguage: string = 'en';

	private languageSubscription?: Subscription;

	constructor (
		private translateService: TranslateService,
		private languageService: LanguageService
	) { }

	/* Angular lifecycle
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

	/* Picker
	--------------------------------------------- */
	open(): void
	{
		this.isOpen = true;
	}

	close(): void
	{
		this.isOpen = false;
	}

	/* Languages
	--------------------------------------------- */
	public getAvailableLanguages(): string[]
	{
		return this.translateService.getLangs();
	}

	public changeLanguage( lang: string ): void
	{
		this.translateService.use( lang );
		this.currentLanguage = lang;

		this.close();
	}

	public getLabel( locale: string ): string
	{
		return this.languageService.getLabel( locale );
	}

	public getFlag( locale: string ): string
	{
		return this.languageService.getFlag( locale );
	}
}
