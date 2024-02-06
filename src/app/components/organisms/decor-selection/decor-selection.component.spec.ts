import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorSelectionComponent } from './decor-selection.component';

describe( 'DecorSelectionComponent', () =>
{
	let component: DecorSelectionComponent;
	let fixture: ComponentFixture<DecorSelectionComponent>;

	beforeEach( async () =>
	{
		await TestBed.configureTestingModule( {
			imports: [ DecorSelectionComponent ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( DecorSelectionComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () =>
	{
		expect( component ).toBeTruthy();
	} );
} );
