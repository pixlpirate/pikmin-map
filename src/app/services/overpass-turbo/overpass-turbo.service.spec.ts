import { TestBed } from '@angular/core/testing';

import { OverpassTurboService } from './overpass-turbo.service';

describe( 'OverpassTurboService', () =>
{
	let service: OverpassTurboService;

	beforeEach( () =>
	{
		TestBed.configureTestingModule( {} );
		service = TestBed.inject( OverpassTurboService );
	} );

	it( 'should be created', () =>
	{
		expect( service ).toBeTruthy();
	} );
} );
