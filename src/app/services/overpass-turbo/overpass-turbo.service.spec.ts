import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { LatLngBounds } from 'leaflet';

import { MapService } from '@services';
import { Decor } from '@interfaces';
import { environment } from '@environments';

import { OverpassTurboService } from './overpass-turbo.service';

describe('OverpassTurboService', () => {
	const decor: Decor = { icon: 'Cafe', label: 'Café', tags: ['amenity=cafe'] };
	const answer = { elements: [] };

	let service: OverpassTurboService;
	let http: HttpTestingController;
	let boundsSpy: jasmine.Spy;

	/** Asks for results over an area, as the map does once it stops moving */
	function ask(south: number, west: number, north: number, east: number): void {
		boundsSpy.and.returnValue(new LatLngBounds([south, west], [north, east]));
		service.fetchOverpassTurboResults([decor]);
		tick(300);
	}

	const mirror = (): TestRequest[] => http.match((req) => req.url.startsWith(environment.mirrorInstance));
	const overpass = (): TestRequest[] => http.match((req) => req.url.startsWith(environment.overpassInstance));
	const fail = (request: TestRequest, status: number): void =>
		request.flush('', { status, statusText: 'error' });

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});

		http = TestBed.inject(HttpTestingController);
		boundsSpy = spyOn(TestBed.inject(MapService), 'getBounds');
		service = TestBed.inject(OverpassTurboService);

		// The decor list the service loads when it is created
		http.match((req) => req.url.includes('decors.json')).forEach((req) => req.flush([]));
	});

	it('asks the mirror first and leaves Overpass alone when it answers', fakeAsync(() => {
		ask(49.6, 6.1, 49.7, 6.2);

		const [request] = mirror();

		request.flush(answer);

		expect(overpass().length).toBe(0);
	}));

	it('falls back on Overpass when the mirror does not cover the area', fakeAsync(() => {
		ask(33.5, -7.7, 33.6, -7.5);

		fail(mirror()[0], 404);

		expect(overpass().length).toBe(1);
	}));

	it('does not ask the mirror again inside an area it said it does not cover', fakeAsync(() => {
		ask(33.0, -8.0, 34.0, -7.0);
		fail(mirror()[0], 404);
		overpass()[0].flush(answer);

		// A smaller area within it
		ask(33.5, -7.7, 33.6, -7.5);

		expect(mirror().length).toBe(0);
		expect(overpass().length).toBe(1);
	}));

	it('still asks the mirror about another area after a 404', fakeAsync(() => {
		ask(33.0, -8.0, 34.0, -7.0);
		fail(mirror()[0], 404);
		overpass()[0].flush(answer);

		ask(49.6, 6.1, 49.7, 6.2);

		const requests = mirror();

		expect(requests.length).toBe(1);
		requests[0].flush(answer);
	}));

	it('falls back on Overpass when the mirror is down, then leaves it alone for a while', fakeAsync(() => {
		ask(49.6, 6.1, 49.7, 6.2);
		fail(mirror()[0], 500);
		expect(overpass().length).toBe(1);

		ask(48.8, 2.3, 48.9, 2.4);

		expect(mirror().length).toBe(0);
		expect(overpass().length).toBe(1);
	}));

	it('falls back on Overpass when the mirror takes too long', fakeAsync(() => {
		ask(49.6, 6.1, 49.7, 6.2);

		// Never answered
		const [request] = mirror();

		tick(6000);

		expect(request.cancelled).toBeTrue();
		expect(overpass().length).toBe(1);
	}));

	it('does not put the mirror aside for a query it does not understand', fakeAsync(() => {
		ask(49.6, 6.1, 49.7, 6.2);
		fail(mirror()[0], 400);
		overpass()[0].flush(answer);

		ask(48.8, 2.3, 48.9, 2.4);

		const requests = mirror();

		expect(requests.length).toBe(1);
		requests[0].flush(answer);
	}));

	describe('instance picker', () => {
		/** A fresh service, as after reloading the page */
		function reload(): OverpassTurboService {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				imports: [TranslateModule.forRoot()],
				providers: [provideHttpClient(), provideHttpClientTesting()],
			});

			http = TestBed.inject(HttpTestingController);
			boundsSpy = spyOn(TestBed.inject(MapService), 'getBounds');

			return TestBed.inject(OverpassTurboService);
		}

		beforeEach(() => localStorage.removeItem('overpassInstance'));
		afterEach(() => localStorage.removeItem('overpassInstance'));

		it('offers only the mirror and overpass-api.de, the mirror first', () => {
			expect(service.getAvailableInstances().map((option) => option.value)).toEqual([
				environment.mirrorInstance,
				environment.overpassInstance,
			]);
		});

		it('uses the mirror until the user chooses, and stores nothing before', () => {
			expect(service.getCurrentInstance()).toBe(environment.mirrorInstance);
			expect(localStorage.getItem('overpassInstance')).toBeNull();
		});

		it('asks only overpass-api.de once it is chosen', fakeAsync(() => {
			service.setCurrentInstance(environment.overpassInstance);

			ask(49.6, 6.1, 49.7, 6.2);

			expect(mirror().length).toBe(0);
			expect(overpass().length).toBe(1);
		}));

		it('remembers the choice after a reload', () => {
			service.setCurrentInstance(environment.overpassInstance);

			expect(reload().getCurrentInstance()).toBe(environment.overpassInstance);
		});

		it('goes back to the mirror, and remembers that too', () => {
			service.setCurrentInstance(environment.overpassInstance);
			service.setCurrentInstance(environment.mirrorInstance);

			expect(reload().getCurrentInstance()).toBe(environment.mirrorInstance);
		});

		it('ignores a stored instance that is no longer offered', () => {
			localStorage.setItem('overpassInstance', JSON.stringify('https://overpass.private.coffee/api/interpreter'));

			expect(reload().getCurrentInstance()).toBe(environment.mirrorInstance);
		});

		it('ignores an instance it does not know when one is set', () => {
			service.setCurrentInstance('https://example.org/api/interpreter');

			expect(service.getCurrentInstance()).toBe(environment.mirrorInstance);
		});
	});
});
