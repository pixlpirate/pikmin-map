import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

import { LanguagePickerComponent } from '../../organisms/language-picker/language-picker.component';
import { Subscription } from 'rxjs';
import { MappingTableComponent } from '../../organisms/mapping-table/mapping-table.component';

/**
 * The about page component used to display information about the project.
 */
@Component( {
	selector: 'app-page-about',
	standalone: true,
	imports: [ CommonModule, LanguagePickerComponent, MarkdownComponent, MappingTableComponent, RouterLink, TranslateModule ],
	templateUrl: './page-about.component.html',
	styleUrl: './page-about.component.scss'
} )
export class PageAboutComponent implements OnInit, OnDestroy
{
	public currentLanguage: string = 'en';
	private languageSubscription?: Subscription;
	private hasScrolledToAnchor = false;

	public content: any = {
		about: false,
		faq: false,
		changelog: false
	};

	constructor (
		private router: Router,
		private markdownService: MarkdownService,
		private translateService: TranslateService
	) { }

	/* Angular Lifecycle
	--------------------------------------------- */
	public ngOnInit()
	{
		this.currentLanguage = this.translateService.currentLang;
		this.languageSubscription = this.translateService.onLangChange.subscribe( ( event ) =>
		{
			// Reset the content
			Object.keys( this.content ).forEach( key => this.content[ key ] = false );
			this.hasScrolledToAnchor = false;

			// Update the current language
			this.currentLanguage = event.lang;
		} );

		// Remap the headings to include anchor links
		this.markdownService.renderer.heading = ( text: string, level: number, raw: string ) =>
		{
			// generate id from text
			let id = this.generateId( raw );


			// Get current route and remove the anchor
			const currentRoute = this.router.url.split( '#' )[ 0 ];

			return '<h' + level + ' id="' + id + '" class="anchor-title">' +
				'<a class="anchor" href="' + currentRoute + '#' + id + '" aria-label="' + this.translateService.instant( 'ANCHOR_TO' ) + ': ' + raw + '">' +
				'<i class="icon icon-link"></i>' +
				'</a>' + text +
				'</h' + level + '>';
		};
	}

	public ngOnDestroy()
	{
		this.languageSubscription?.unsubscribe();
	}

	/* Navigation
	--------------------------------------------- */

	public navigateTo( path: string )
	{
		this.router.navigate( [ path ], { replaceUrl: true } );
	}

	/* Markdown
	--------------------------------------------- */
	public scrollToAnchor()
	{
		const anchor = window.location.hash;
		if ( anchor ) {
			const element = document.querySelector( anchor );
			if ( element ) {
				element.scrollIntoView( { behavior: "smooth" } );
			}
		}
	}

	public allContentLoaded(): boolean
	{
		const loaded = Object.values( this.content ).every( value => value === true );

		if ( loaded && !this.hasScrolledToAnchor ) {
			this.scrollToAnchor();
			this.hasScrolledToAnchor = true;
		}

		return loaded;
	}

	public generateId( text: string ): string
	{
		return text
			.replace( /<[^>]*>/g, "" )				// remove html tags
			.normalize( "NFD" )						// normalize diacritics
			.replace( /[\u0300-\u036f]/g, "" )		// remove diacritics
			.replace( /[^a-z0-9 ]/gi, '' )			// remove non alphanumeric or space characters
			.trim()									// remove leading and trailing spaces
			.toLowerCase()							// convert to lowercase
			.replace( / /g, '-' );					// replace spaces with
	}
}
