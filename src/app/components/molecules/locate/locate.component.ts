import { Component } from '@angular/core';

import { LocationEvent, Marker, marker, DivIcon, divIcon } from 'leaflet';

import { MapService } from '../../../services';

/**
 * The locate button displayed at the bottom left of the map.
 */
@Component( {
	selector: 'app-locate',
	standalone: true,
	imports: [],
	templateUrl: './locate.component.html',
	styleUrl: './locate.component.scss'
} )
export class LocateComponent
{
	private marker?: Marker;
	private markerIcon: DivIcon = divIcon( {
		className: "marker-location",
		iconSize: undefined
	} );

	constructor (
		private mapService: MapService
	) { }

	public locate(): void
	{
		const map = this.mapService.getMap();

		map.locate( { setView: false, watch: true } )
			.on( 'locationfound', ( event: LocationEvent ) =>
			{
				if ( this.marker ) {

					// Already located, update marker
					this.marker.getPopup()?.setContent( this.getPopupContent( event.accuracy ) );
					this.marker.setLatLng( event.latlng );

				} else {

					// Located for the first time, set marker
					this.marker = marker(
						event.latlng,
						{ icon: this.markerIcon }
					).addTo( map ).bindPopup( this.getPopupContent( event.accuracy ) );

					this.mapService.flyTo(
						event.latlng,
						18,
					);
				}
			} );
	}

	private getPopupContent( accuracy: number ): string
	{
		return `
			<div class="popup-location">
				<span>You! 📍 ~${Math.round( accuracy )}m</span>
			</div>
		`;
	}
}
