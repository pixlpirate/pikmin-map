import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateComponent } from './locate.component';

describe( 'LocateComponent', () =>
{
	let component: LocateComponent;
	let fixture: ComponentFixture<LocateComponent>;

	beforeEach( async () =>
	{
		await TestBed.configureTestingModule( {
			imports: [ LocateComponent ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( LocateComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () =>
	{
		expect( component ).toBeTruthy();
	} );
} );
