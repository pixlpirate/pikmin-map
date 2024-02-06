import { TestBed } from '@angular/core/testing';

import { DecorService } from './decor.service';

describe( 'DecorService', () =>
{
	let service: DecorService;

	beforeEach( () =>
	{
		TestBed.configureTestingModule( {} );
		service = TestBed.inject( DecorService );
	} );

	it( 'should be created', () =>
	{
		expect( service ).toBeTruthy();
	} );
} );
