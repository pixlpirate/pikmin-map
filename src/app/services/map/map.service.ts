import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
	circle,
	divIcon,
	LatLng,
	LatLngBounds,
	LayerGroup,
	Map,
	Marker,
	Polyline,
	tileLayer,
} from 'leaflet';

import {
	AdvancedOptionsService,
	EventBusService,
	LocalStorageService,
} from '@services';
import { Decor, LocalMapData, OverpassTurboResult } from '@interfaces';

@Injectable({
	providedIn: 'root',
})
export class MapService {
	private map!: Map;
	private decorLayer: LayerGroup = new LayerGroup();

	constructor(
		private localStorageService: LocalStorageService,
		private eventBusService: EventBusService,
		private translateService: TranslateService,
		private advancedOptionsService: AdvancedOptionsService
	) {}

	/**
	 * Initializes the map, controls, and marker layer. Sets the initial view and binds events.
	 *
	 * @param element - The HTML element where the map will be rendered.
	 * @returns void
	 */
	public init(element: HTMLElement): void {
		/* Creation */
		this.map = new Map(element, {
			zoomControl: false,
		});

		// ! Must be set before setView
		this.map.on('load', () => {
			this.decorLayer.addTo(this.map); // Add the decor layer to the map
		});

		/* Config */
		tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright" aria-label="navigate to OSM copyright">OpenStreetMap</a>',
		}).addTo(this.map);

		if (this.hasUrlParams()) {
			// If URL has lat/lng/zoom params, update map view from URL parameters
			this.updateFromUrl();
		} else {
			// Otherwise, set map view from local storage
			const localMapData: LocalMapData = this.getLocalMapData();
			this.map.setView(localMapData.pos, localMapData.zoom);
		}

		/* Events */
		this.map.on('zoomend', () => {
			this.eventBusService.setMapChange();
		});

		this.map.on('moveend', () => {
			this.eventBusService.setMapChange();
		});
	}

	/* Map
	--------------------------------------------- */
	/**
	 * Returns the current map instance.
	 *
	 * @returns {Map} The current map instance.
	 */
	public getMap(): Map {
		return this.map;
	}

	/**
	 * Returns the current viewport map bounds (min lat/lng & max lat/lng).
	 *
	 * @returns {LatLngBounds} The current viewport map bounds.
	 */
	public getBounds(): LatLngBounds {
		return this.map.getBounds();
	}

	/**
	 * Flies to the specified bounds (min lat/lng & max lat/lng).
	 *
	 * @param bounds - The bounds to fly to.
	 * @returns void
	 */
	public flyToBounds(bounds: LatLngBounds): void {
		this.map.flyToBounds(bounds, {
			duration: 1.5,
		});
	}

	/**
	 * Flies to the specified lat/lng position.
	 *
	 * @param pos - The lat/lng position to fly to.
	 * @param zoom - The zoom level.
	 * @returns void
	 */
	public flyTo(pos: LatLng, zoom: number): void {
		this.map.flyTo(pos, zoom, {
			duration: 1.5,
		});
	}

	/* Markers
	--------------------------------------------- */
	/**
	 * Adds a marker to the marker layer at the specified latitude and longitude.
	 *
	 * @param lat - The latitude where the marker will be placed.
	 * @param lng - The longitude where the marker will be placed.
	 * @returns void
	 */
	public addMarker(
		lat: number,
		lng: number,
		item: OverpassTurboResult
	): void {
		if (this.advancedOptionsService.hideMarkers) return;

		const icon = divIcon({
			className: 'marker',
			html: `<div class="marker-pin">${this.getMarkerIcon(
				item.decors
			)}</div>`,
			iconSize: [38, 50],
		});

		const marker: Marker = new Marker([lat, lng], { icon: icon });

		marker.bindPopup(this.getMarkerPopup(item));

		this.decorLayer.addLayer(marker);

		if (this.advancedOptionsService.showDecorRadius) {
			this.addMarkerRadius(lat, lng);
		}
	}

	/**
	 * Adds a circle around the marker for a visual representation help of the overlaping decors.
	 *
	 * @param lat - The latitude where the marker will be placed.
	 * @param lng - The longitude where the marker will be placed.
	 * @returns void
	 */
	public addMarkerRadius(lat: number, lng: number): void {
		const radius = this.advancedOptionsService.decorRadiusSize;
		const c = circle([lat, lng], {
			color: '#e76761',
			fillColor: '#e76761',
			fillOpacity: 0.2,
			radius: radius,
		});

		console.log('radius', radius);
		this.decorLayer.addLayer(c);
	}

	/**
	 * Generate icon for a given array of decors.
	 *
	 * @param decors - An array of Decor objects matching the marker.
	 * @returns A string representing the HTML for the marker icon.
	 */
	private getMarkerIcon(decors: Decor[]): string {
		// Get last checked decor matching decors
		const decor = this.eventBusService
			.getCheckedDecors()
			.find((checkedDecor: Decor) =>
				decors.some(
					(decor: Decor) => decor.label === checkedDecor.label
				)
			);
		let icon = `<img src="assets/icons/map/${
			decor?.icon
		}.png" alt="${this.translate(
			'ICON_NAME',
			this.translate(decor?.label ?? 'UNKNOWN')
		)}" />`;

		if (decors.length > 1) {
			icon += `<span>+${decors.length - 1}</span>`;
		}

		return icon;
	}

	private getMarkerPopup(item: OverpassTurboResult): string {
		let popup = `<div class="popup-content">`;
		popup += `<a href="https://www.openstreetmap.org/${item.type}/${item.id}" target="_blank" aria-label="Navigate to ${item.name} on OSM">`;
		popup += `<i class="icon icon-link"></i> `;
		popup += item.name;
		popup += `</a>`;

		if (item.decors.length > 1) {
			popup += `<span>${this.translate('MAY_ALSO_FIND')}</span>`;
			popup += `<ul class="popup-decor-list">`;
			item.decors.forEach((decor: Decor) => {
				popup += `<li class="popup-decor-list-item">`;
				popup += `<img class="popup-decor" src="assets/icons/map/${
					decor.icon
				}.png" alt="${this.translate(
					'ICON_NAME',
					this.translate(decor.label)
				)}" />`;
				popup += `</li>`;
			});
			popup += `</ul>`;
		}

		popup += `</div>`;

		return popup;
	}

	/**
	 * Clears all markers from the decor layer.
	 *
	 * @returns void
	 */
	public clearMarkers(): void {
		this.decorLayer.clearLayers();
	}

	/* Polylines
	--------------------------------------------- */
	/**
	 * Adds a polyline to the marker layer at the specified latitudes and longitudes.
	 * Add a marker to the center of the polyline.
	 *
	 * @param latlngs
	 */
	public addPolyline(latlngs: LatLng[], item: OverpassTurboResult): void {
		if (this.advancedOptionsService.hidePaths) return;

		// Only fill if distance between first and last point < 0.1m
		// This avoid filling polylines that are lines instead of areas (e.g. roads)
		const fill =
			this.getDistanceBetweenLatLngs(
				latlngs[0],
				latlngs[latlngs.length - 1]
			) < 0.1;

		const polyline: Polyline = new Polyline(latlngs, {
			color: '#e76761',
			fill: fill,
			fillOpacity: 0.5,
		});
		this.decorLayer.addLayer(polyline);

		const polylineCenter: LatLng = this.getPolylineCenter(latlngs);
		this.addMarker(polylineCenter.lat, polylineCenter.lng, item);
	}

	/**
	 * Calculates the geographical center of a polyline given its vertices.
	 * For concave polylines, the center may not be inside the polyline.
	 *
	 * @param latLngs - An array of LatLng objects representing the vertices of the polyline.
	 * @returns {LatLng} The geographical center of the polyline.
	 */
	private getPolylineCenter(latLngs: LatLng[]): LatLng {
		let sumLat = 0;
		let sumLng = 0;

		for (const latlng of latLngs) {
			sumLat += latlng.lat;
			sumLng += latlng.lng;
		}

		const centerLat = sumLat / latLngs.length;
		const centerLng = sumLng / latLngs.length;

		return new LatLng(centerLat, centerLng);
	}

	/* Utils
	--------------------------------------------- */
	/**
	 * Calculates the approximate equirectangular distance between two lat/lng points in meters.
	 * Faster than using Haversine formula, works well on short distances.
	 *
	 * @param pos1 - The first lat/lng point.
	 * @param pos2 - The second lat/lng point.
	 * @returns {number} The distance between the two points in meters.
	 */
	private getDistanceBetweenLatLngs(pos1: LatLng, pos2: LatLng): number {
		const R = 6371000; // in meters
		const x = (pos2.lng - pos1.lng) * Math.cos((pos1.lat + pos2.lat) / 2);
		const y = pos2.lat - pos1.lat;
		return Math.sqrt(x * x + y * y) * R;
	}

	/* Local storage
	--------------------------------------------- */
	/**
	 * Saves the current map position and zoom level to local storage.
	 * @returns void
	 */
	public setLocalMapData(): void {
		const pos: LatLng = this.map.getCenter();
		const zoom: number = this.map.getZoom();

		this.localStorageService.setItem('map', {
			pos: pos,
			zoom: zoom,
		});
	}

	/**
	 * Retrieves the map position and zoom level from local storage.
	 * If no data is found in local storage, it returns a default position and zoom level.
	 *
	 * @returns {LocalMapData} The map data retrieved from local storage or default values.
	 */
	private getLocalMapData(): LocalMapData {
		const storedMap = this.localStorageService.getItem('map');
		const defaultMap = {
			pos: new LatLng(64.175044, -51.735778),
			zoom: 14,
		};

		return storedMap !== null ? storedMap : defaultMap;
	}

	/* URL
	--------------------------------------------- */
	/**
	 * Updates the URL with the current map position and zoom level.
	 * @returns void
	 */
	public updateUrl(): void {
		const pos: LatLng = this.map.getCenter();
		const zoom: number = this.map.getZoom();

		const url = new URL(window.location.href);
		url.searchParams.set('lat', pos.lat.toString());
		url.searchParams.set('lng', pos.lng.toString());
		url.searchParams.set('zoom', zoom.toString());

		window.history.replaceState({}, '', url.toString());
	}

	private hasUrlParams(): boolean {
		const url = new URL(window.location.href);
		return url.searchParams.has('lat') && url.searchParams.has('lng');
	}

	/**
	 * Updates the map position and zoom level from the URL.
	 * @returns void
	 */
	private updateFromUrl(): void {
		const url = new URL(window.location.href);
		const lat = url.searchParams.get('lat');
		const lng = url.searchParams.get('lng');
		const zoom = url.searchParams.get('zoom');

		if (lat && lng && zoom) {
			this.map.setView(
				new LatLng(parseFloat(lat), parseFloat(lng)),
				parseInt(zoom)
			);
		} else if (lat && lng) {
			this.map.setView(new LatLng(parseFloat(lat), parseFloat(lng)), 18);
		}
	}

	/* Translation
	--------------------------------------------- */
	public translate(key: string, param?: string): string {
		if (param) {
			return this.translateService.instant(key, { param });
		} else {
			return this.translateService.instant(key);
		}
	}
}
