import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, Subscription, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LatLng, LatLngBounds } from 'leaflet';

import {
	DecorService,
	EventBusService,
	MapService,
	ToastService,
} from '@services';
import { Decor } from '@interfaces';
import { environment } from '@environments';

@Injectable({
	providedIn: 'root',
})
export class OverpassTurboService {
	private decors: Decor[] = [];
	private decorSubscription?: Subscription;
	private fetchOverpassTurboResultsSubject = new Subject<Decor[]>();

	constructor(
		private http: HttpClient,
		private mapService: MapService,
		private eventBusService: EventBusService,
		private decorService: DecorService,
		private toastService: ToastService,
		private translateService: TranslateService
	) {
		if (!this.decorSubscription) {
			this.decorSubscription = this.decorService.getDecors().subscribe({
				next: (decors: Decor[]) => (this.decors = decors),
			});
		}

		// Prepare the Overpass Turbo subject
		this.fetchOverpassTurboResultsSubject
			.pipe(
				switchMap((decors) => this.fetchOverpassTurboResults$(decors))
			)
			.subscribe();
	}

	/**
	 * Fetches results from the Overpass Turbo API based on the provided Decor objects.
	 *
	 * @param {Decor[]} decors - An array of Decor objects to be included in the query.
	 * @returns {void} - To get the results subscribe to onOnResultsChange()
	 * It ensures a clear separation between components
	 */
	public fetchOverpassTurboResults(decors: Decor[]): void {
		this.fetchOverpassTurboResultsSubject.next(decors);
	}

	/**
	 * Cancelable subject. Emit the results of the Overpass Turbo API
	 *
	 * @param decors
	 */
	private fetchOverpassTurboResults$(decors: Decor[]): Observable<any> {
		const body = this.prepareOverpassTurboQuery(decors);

		this.toastService.removeAll();

		this.toastService.add({
			message: `<i class="loader icon icon-spin6"></i>${this.translate(
				'LOADING_OVERPASS'
			)}`,
			duration: Infinity,
			id: -1,
			type: 'success',
		});

		return this.http
			.get(
				`https://overpass-api.de/api/interpreter?data=${encodeURI(
					body
				)}`
			)
			.pipe(
				tap((response: any) => {
					this.toastService.remove(-1);

					// Check for errors, Overpass Turbo API does not return error codes
					if (response.remark?.includes('Query timed out')) {
						// Query timed out
						this.toastService.add({
							message: this.translate('ERROR_TIMEOUT'),
							type: 'error',
							duration: environment.toastDuration,
						});

						return;
					} else if (response.remark?.includes('Too Many Requests')) {
						// Too many requests
						this.toastService.add({
							message: this.translate('ERROR_TOO_MANY_REQUESTS'),
							type: 'error',
							duration: environment.toastDuration,
						});

						return;
					}

					// Only keep nodes and ways
					const elements = response.elements.filter(
						(element: any) =>
							element.type === 'node' || element.type === 'way'
					);

					// No results or too many results
					if (elements.length === 0) {
						this.toastService.add({
							message: this.translate('WARNING_NO_RESULTS'),
							type: 'warning',
							duration: environment.toastDuration,
						});
					} else if (elements.length > 1000) {
						elements.splice(1000);

						this.toastService.add({
							message: this.translate('WARNING_TOO_MANY_RESULTS'),
							type: 'warning',
							duration: environment.toastDuration,
						});
					}

					// Return the formatted results
					this.eventBusService.setOverpassTurboResults(
						elements.map((element: any) => {
							return {
								id: element.id,
								name: element.tags.name
									? element.tags.name
									: `${this.translate('UNKNOWN_NAME')}`,
								type: element.type,
								geometry: element.geometry
									? element.geometry.map(
											(geo: {
												lat: number;
												lon: number;
											}) => new LatLng(geo.lat, geo.lon)
									  )
									: [new LatLng(element.lat, element.lon)],
								decors: this.getDecors(element.tags),
							};
						})
					);
				})
			);
	}

	/* Helpers
	--------------------------------------------- */
	/**
	 * Prepares an Overpass Turbo query string based on the provided Decor objects.
	 *
	 * @param decors - An array of Decor objects to be included in the query.
	 * @returns {string} - The prepared Overpass Turbo query string.
	 */
	public prepareOverpassTurboQuery(decors: Decor[]): string {
		const bounds: LatLngBounds = this.mapService.getBounds();
		const bbox: string = [
			bounds.getSouthWest().lat,
			bounds.getSouthWest().lng,
			bounds.getNorthEast().lat,
			bounds.getNorthEast().lng,
		].join(',');

		let body: string = `[out:json][timeout:5];\n(\n`;

		decors.forEach((decor: Decor) => {
			body += decor.area
				? `area["ISO3166-1"="${decor.area}"]->.${decor.area};\n`
				: ``;
		});

		decors.forEach((decor: Decor) => {
			decor.tags.forEach((tag: string | string[]) => {
				if (Array.isArray(tag)) {
					body += `nwr[${tag.join('][')}]`;
				} else {
					body += `nwr[${tag}]`;
				}

				body += decor.area
					? `(area.${decor.area})(${bbox});\n`
					: `(${bbox});\n`;
			});
		});

		body += `);\nout geom;`;

		return body;
	}

	/**
	 * Filters the tags of an Overpass Turbo result.
	 *
	 * @param tags - The tags to filter.
	 * @returns {Decor[]} - The Decor objects that match the tags.
	 */
	private getDecors(tags: any): Decor[] {
		const formattedTags = Object.keys(tags).map(
			(key: string) => `${key}~${tags[key]}`
		);
		let decors: Decor[] = [];

		this.decors.forEach((decor: Decor) => {
			decor.tags.forEach((tag: string | string[]) => {
				if (Array.isArray(tag)) {
					if (tag.every((t: string) => formattedTags.includes(t))) {
						decors.push(decor);
					}
				} else {
					if (formattedTags.includes(tag)) {
						decors.push(decor);
					}
				}
			});
		});

		return decors;
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
	public translate(key: string): string {
		return this.translateService.instant(key);
	}
}
