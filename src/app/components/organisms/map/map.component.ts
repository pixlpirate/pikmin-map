import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { LocateComponent } from '../../../components';
import { SearchBarComponent } from '../search-bar/search-bar.component'; // Cannont import it from ../../../components/ ?
import { EventBusService, MapService } from '../../../services';
import { OverpassTurboResult } from '../../../models';

/**
 * The map component used to display the map and its related components (locate, search bar).
 * Most of the logic is handled by the MapService.
 */
@Component( {
	selector: 'app-map',
	standalone: true,
	imports: [ LocateComponent, SearchBarComponent ],
	templateUrl: './map.component.html',
	styleUrls: [ './map.component.scss' ]
} )
export class MapComponent implements AfterViewInit, OnDestroy
{
	@ViewChild( 'map' ) map?: ElementRef;

	public overpassTurboResultChangeSubscription?: Subscription;
	public mapChangeSubscription?: Subscription;

	constructor (
		private mapService: MapService,
		private eventBusService: EventBusService
	) { }

	public ngAfterViewInit(): void
	{
		if ( this.map ) {
			this.mapService.init( this.map.nativeElement );

			// Listen to overpass results change events
			this.overpassTurboResultChangeSubscription = this.eventBusService.onOverpassTurboResultsChange().subscribe( ( results: OverpassTurboResult[] ) =>
			{
				this.mapService.clearMarkers();
				results.forEach( ( result: OverpassTurboResult ) =>
				{
					if ( result.type === "node" ) {
						this.mapService.addMarker( result.geometry[ 0 ].lat, result.geometry[ 0 ].lng, result );
					} else if ( result.type === "way" ) {
						this.mapService.addPolyline( result.geometry, result );
					}
				} );
			} );

			// Listen to map change events
			this.mapChangeSubscription = this.eventBusService.onMapChange().subscribe( () =>
			{
				this.mapService.setLocalMapData();
				this.mapService.updateUrl();
			} );
		}
	}

	public ngOnDestroy(): void
	{
		this.mapService.clearMarkers();
		this.overpassTurboResultChangeSubscription?.unsubscribe();
		this.mapChangeSubscription?.unsubscribe();
	}
}
