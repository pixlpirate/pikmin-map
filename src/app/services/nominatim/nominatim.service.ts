import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { LatLng, LatLngBounds } from 'leaflet';

import { NominatimResult } from '@interfaces';

@Injectable({
	providedIn: 'root',
})
export class NominatimService {
	constructor(private http: HttpClient) {}

	/**
	 * Fetches geolocation data from the Nominatim API based on the provided location string.
	 * @param location - The location string to search for in the Nominatim API.
	 * @returns {Observable<NominatimResult[]>} - An Observable that emits an array of NominatimResult objects.
	 */
	public getNominatimResults(
		location: string
	): Observable<NominatimResult[]> {
		return this.http
			.get(
				`https://nominatim.openstreetmap.org/search?q=${encodeURI(
					location
				)}&format=json`
			)
			.pipe(
				map((response: any) => {
					return response
						.filter(
							(obj: any) => obj.display_name && obj.boundingbox
						)
						.map((obj: any) => {
							return {
								name: obj.display_name,
								bbox: new LatLngBounds(
									new LatLng(
										obj.boundingbox[0],
										obj.boundingbox[2]
									),
									new LatLng(
										obj.boundingbox[1],
										obj.boundingbox[3]
									)
								),
							};
						});
				})
			);
	}
}
