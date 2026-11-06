import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, Subscription, switchMap, tap, debounceTime, distinctUntilChanged, catchError, of, timeout } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LatLng, LatLngBounds } from 'leaflet';

import {
	DecorService,
	EventBusService,
	LocalStorageService,
	MapService,
	ToastService,
} from '@services';
import { Decor, DecorQuery, SelectOption } from '@interfaces';
import { environment } from '@environments';

@Injectable({
	providedIn: 'root',
})
export class OverpassTurboService {
	private readonly storageKey = 'overpassInstance';

	/**
	 * What the user can pick. Anything else, including an instance stored before
	 * this list was cut down, is ignored. The mirror is first and the default.
	 */
	private readonly overpassInstances: SelectOption[] = [
		{
			// Self-hosted SQLite mirror built by the pikmin-map-data repository.
			// Fast, but may be outdated, and only covers the countries it was built for:
			// elsewhere the public instance below answers instead.
			label: 'pixelpirate.fr',
			value: environment.mirrorInstance,
			description: 'DATA_SOURCE_OPTION_LIMITED_COVERAGE',
		},
		{
			label: 'overpass-api.de',
			value: environment.overpassInstance,
			description: 'DATA_SOURCE_OPTION_WORLDWIDE',
		},
	];

	private currentInstance: string;

	/** The self-hosted mirror answers or it does not: a slow one is not waited for */
	private readonly mirrorTimeout = 6000;

	/** After a failure that is not about the area, the mirror is left alone this long */
	private readonly mirrorCooldown = 60000;

	private mirrorDownUntil = 0;

	/** Areas the mirror said it does not cover, so that panning inside them skips it */
	private readonly uncoveredBounds: DecorQuery['bounds'][] = [];
	private readonly maxUncoveredBounds = 20;

	private decors: Decor[] = [];
	private decorSubscription?: Subscription;
	private fetchOverpassTurboResultsSubject = new Subject<DecorQuery>();

	constructor(
		private http: HttpClient,
		private mapService: MapService,
		private eventBusService: EventBusService,
		private decorService: DecorService,
		private localStorageService: LocalStorageService,
		private toastService: ToastService,
		private translateService: TranslateService,
	) {
		this.currentInstance = this.resolveStoredInstance();

		if (!this.decorSubscription) {
			this.decorSubscription = this.decorService.getDecors().subscribe({
				next: (decors: Decor[]) => (this.decors = decors),
			});
		}

		// Prepare the Overpass Turbo subject
		this.fetchOverpassTurboResultsSubject
			.pipe(
				debounceTime(300),
				distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
				switchMap((decorQuery) => this.fetchOverpassTurboResults$(decorQuery)),
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
		// An empty selection needs no viewport, and asking for one before the
		// map exists throws - this runs once on startup, before it is ready.
		if (!decors.length) {
			this.fetchOverpassTurboResultsSubject.next({ decors: [], bounds: [0, 0, 0, 0] });

			return;
		}

		const bounds: LatLngBounds = this.mapService.getBounds();
		const decorQuery: DecorQuery = {
			decors: decors,
			bounds: [
				bounds.getSouthWest().lat,
				bounds.getSouthWest().lng,
				bounds.getNorthEast().lat,
				bounds.getNorthEast().lng,
			],
		};

		this.fetchOverpassTurboResultsSubject.next(decorQuery);
	}

	public getAvailableInstances(): SelectOption[] {
		return this.overpassInstances;
	}

	public getCurrentInstance(): string {
		return this.currentInstance;
	}

	/** Remembered from then on: it is only stored once the user has chosen. */
	public setCurrentInstance(instance: string): void {
		this.currentInstance = this.isKnownInstance(instance) ? instance : this.defaultInstance();
		this.localStorageService.setItem(this.storageKey, this.currentInstance);
	}

	/**
	 * Cancelable subject. Emit the results of the Overpass Turbo API
	 *
	 * @param decorQuery
	 */
	private fetchOverpassTurboResults$(decorQuery: DecorQuery): Observable<any> {
		// Nothing selected: clear the results without a request. The query would
		// carry no nwr statement, which is not something to ask an instance.
		if (!decorQuery.decors.length) {
			this.toastService.removeAll();
			this.eventBusService.setOverpassTurboResults([]);

			return of(null);
		}

		const body = this.prepareOverpassTurboQuery(decorQuery);

		this.toastService.removeAll();

		this.toastService.add({
			message: `<i class="loader icon icon-spin6"></i>${this.translate(
				'LOADING_OVERPASS',
			)}`,
			duration: Infinity,
			id: -1,
			type: 'success',
		});

		return this.requestWithFallback$(decorQuery.bounds, body);
	}

	/**
	 * The self-hosted mirror is asked first. The public Overpass instance only gets
	 * the query when the mirror cannot answer it: the area is not covered, the query
	 * is not supported, or the mirror is down or too slow. A user who chose the public
	 * instance has it asked directly.
	 *
	 * @param bounds - South, west, north, east of the query
	 * @param body - The prepared Overpass QL query
	 */
	private requestWithFallback$(bounds: DecorQuery['bounds'], body: string): Observable<any> {
		const overpass$ = this.request$(environment.overpassInstance, body).pipe(
			catchError((response: any) => this.handleRequestError(response)),
		);

		if (this.currentInstance !== environment.mirrorInstance || !this.shouldTryMirror(bounds)) {
			return overpass$;
		}

		return this.request$(environment.mirrorInstance, body).pipe(
			timeout(this.mirrorTimeout),
			catchError((response: any) => {
				this.noteMirrorFailure(response, bounds);

				return overpass$;
			}),
		);
	}

	private shouldTryMirror(bounds: DecorQuery['bounds']): boolean {
		return Date.now() >= this.mirrorDownUntil
			&& !this.uncoveredBounds.some((area) => this.contains(area, bounds));
	}

	/**
	 * 404 is the mirror saying it has no data there (and 400 that it does not
	 * understand the query): neither says anything about whether it is up. Any
	 * other failure - no answer, an error, a timeout - puts it aside for a while,
	 * so that every pan of the map does not wait for it again.
	 */
	private noteMirrorFailure(response: any, bounds: DecorQuery['bounds']): void {
		if (response?.status === 404) {
			this.uncoveredBounds.push(bounds);

			if (this.uncoveredBounds.length > this.maxUncoveredBounds) {
				this.uncoveredBounds.shift();
			}
		} else if (response?.status !== 400) {
			this.mirrorDownUntil = Date.now() + this.mirrorCooldown;
		}
	}

	/** Whether `inner` lies within `outer`, both as south, west, north, east */
	private contains(outer: DecorQuery['bounds'], inner: DecorQuery['bounds']): boolean {
		return outer[0] <= inner[0] && outer[1] <= inner[1] && outer[2] >= inner[2] && outer[3] >= inner[3];
	}

	/**
	 * Runs the query against one instance and publishes the formatted results.
	 *
	 * @param instance - Base URL of the Overpass instance to ask
	 * @param body - The prepared Overpass QL query
	 */
	private request$(instance: string, body: string): Observable<any> {
		return this.http
			.get(
				`${instance}?data=${encodeURI(
					body,
				)}`,
			)
			.pipe(
				tap((response: any) => {
					this.toastService.remove(-1);

					// Direct node and way elements
					const nodeWayElements = response.elements.filter(
						(element: any) =>
							element.type === 'node' || element.type === 'way',
					);

					// Relation members node and way elements
					// (ex. areas with bool subtract operation)
					const relationElements = response.elements
						.filter((e: any) => e.type === 'relation')
						.flatMap((relation: any) =>
							(relation.members || [])
								.filter(
									(m: any) =>
										m.type === 'node' || m.type === 'way',
								)
								.filter((m: any) => m.role !== 'inner') // Exclude inner members (boolean holes)
								.map((m: any) => ({
									...m,
									id: m.ref ?? m.id,
									type: m.type,
									tags: relation.tags || {},
								})),
						);

					const elements = [...nodeWayElements, ...relationElements];

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
										}) => new LatLng(geo.lat, geo.lon),
									)
									: [new LatLng(element.lat, element.lon)],
								decors: this.getDecors(element.tags),
							};
						}),
					);
				}),
			);
	}

	/**
	 * Turn failed request into a toast. Overpass does not use error codes in
	 * its body, so the HTTP status is all there is to go on.
	 */
	private handleRequestError(response: any): Observable<null> {
		this.toastService.remove(-1);

		if (response.status === 504) {
			// Query timed out
			this.toastService.add({
				message: this.translate('ERROR_TIMEOUT'),
				type: 'error',
				duration: environment.toastDuration,
			});
		} else if (response.status === 429) {
			// Too many requests
			this.toastService.add({
				message: this.translate('ERROR_TOO_MANY_REQUESTS'),
				type: 'error',
				duration: environment.toastDuration,
			});
		} else {
			console.error('Unknown error occurred of Overpass Turbo request:', response);
		}

		return of(null);
	}

	/* Helpers
	--------------------------------------------- */
	/**
	 * Prepares an Overpass Turbo query string based on the provided Decor objects.
	 *
	 * @param decorQuery - An DecorQuery object to be extened in the query.
	 * @returns {string} - The prepared Overpass Turbo query string.
	 */
	public prepareOverpassTurboQuery(decorQuery: DecorQuery): string {
		const decors = decorQuery.decors;
		const bbox: string = decorQuery.bounds.join(',');
		let body: string = `[out:json][timeout:5][bbox:${bbox}];\n(\n`;

		// Stocker les zones définies
		const areas = new Set<string>();

		decors.forEach((decor: Decor) => {
			if (decor.area) {
				areas.add(decor.area);
			}
		});

		areas.forEach((area) => {
			body += `area["ISO3166-1"="${area}"]->.${area};\n`;
		});

		decors.forEach((decor: Decor) => {
			decor.tags.forEach((tag: string | string[]) => {
				if (Array.isArray(tag)) {
					body += `nwr[${tag.join('][')}]`;
				} else {
					const [key, value] = tag.split('=');
					if (key && value) {
						body += `nwr["${key}"~"(^|;)?${value}($|;)"]`;
					}
				}

				body += decor.area ? `(area.${decor.area});\n` : `;\n`;
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
		const formattedTags = Object.keys(tags).flatMap(
			(key: string) =>
				tags[key]
					.split(';') // Split the value by ';' if it contains multiple values
					.map((value: string) => `${key}=${value.trim()}`), // Trim and format each entry
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

	private defaultInstance(): string {
		return environment.mirrorInstance;
	}

	private resolveStoredInstance(): string {
		const storedInstance = this.localStorageService.getItem(this.storageKey);

		return this.isKnownInstance(storedInstance) ? storedInstance : this.defaultInstance();
	}

	private isKnownInstance(instance: unknown): instance is string {
		return typeof instance === 'string'
			&& this.overpassInstances.some((option) => option.value === instance);
	}
}
