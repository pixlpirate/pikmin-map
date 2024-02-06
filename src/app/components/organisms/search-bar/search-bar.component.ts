import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, Subscription, debounceTime, mergeMap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LatLngBounds } from 'leaflet';

import { MapService, NominatimService } from '../../../services';
import { NominatimResult } from '../../../models';
import { ClickOutsideDirective } from '../../../directives';

/**
 * The search bar component and it's dropdown used to search for a location and fly to it.
 */
@Component( {
	selector: 'app-search-bar',
	standalone: true,
	imports: [ CommonModule, FormsModule, ClickOutsideDirective ],
	templateUrl: './search-bar.component.html',
	styleUrls: [ './search-bar.component.scss' ]
} )
export class SearchBarComponent implements OnInit, OnDestroy
{
	public searchInput: string = "";
	public searchInput$ = new Subject<void>();
	public searchInputFocused: boolean = false;
	private searchInputSubscription?: Subscription;

	public searchResultsLoading: boolean = false;
	public searchResults: NominatimResult[] = [];

	constructor (
		private nominatimService: NominatimService,
		private mapService: MapService,
		private translateService: TranslateService
	) { }

	/* Angular Lifecycle
	--------------------------------------------- */
	ngOnInit(): void
	{
		this.searchInputSubscription = this.searchInput$.pipe(
			debounceTime( 300 ),
			mergeMap( () =>
			{
				this.searchResultsLoading = true;
				return this.nominatimService.getNominatimResults( this.searchInput );
			} )
		).subscribe( {
			next: ( response: NominatimResult[] ) =>
			{
				this.searchResultsLoading = false;
				this.searchResults = response;
			},
			error: ( error: any ) =>
			{
				console.error( error );
			}
		} );
	}

	ngOnDestroy(): void
	{
		this.searchInputSubscription?.unsubscribe();
	}

	/* Component
	--------------------------------------------- */
	public onClickOutside(): void
	{
		this.searchInputFocused = false;
	}

	/* Map Service
	--------------------------------------------- */
	public flyTo( boundingbox: LatLngBounds ): void
	{
		this.mapService.flyToBounds( boundingbox );
		this.searchInputFocused = false;
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
