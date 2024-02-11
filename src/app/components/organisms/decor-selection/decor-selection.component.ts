import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DecorService, EventBusService, MapService, OverpassTurboService } from '../../../services';
import { Decor } from '../../../models';

/**
 * The decor selection component used to display the bottom center list of decors that can be checked or unchecked.
 * Responsive make it looks like it's a different component, but it's the same.
 */
@Component( {
	selector: 'app-decor-selection',
	standalone: true,
	imports: [ CommonModule, ReactiveFormsModule, TranslateModule ],
	templateUrl: './decor-selection.component.html',
	styleUrl: './decor-selection.component.scss'
} )
export class DecorSelectionComponent implements OnInit, OnDestroy
{
	public form?: FormGroup;
	public decors: Decor[] = [];
	public isOpen: boolean = false;

	private getDecorSubscription?: Subscription;
	private formChangeSubscription?: Subscription;
	private checkedDecorChangeSubscription?: Subscription;

	constructor (
		private decorService: DecorService,
		private formBuilder: FormBuilder,
		private mapService: MapService,
		private overpassTurboService: OverpassTurboService,
		private eventBusService: EventBusService,
		private translateService: TranslateService
	) { }

	/* Angular Lifecycle
	--------------------------------------------- */
	public ngOnInit(): void
	{
		this.getDecorSubscription = this.decorService.getDecors().subscribe( {
			next: ( decors: Decor[] ) =>
			{
				this.decors = decors;
				this.form = this.formBuilder.group( {} );

				// For each decor, create a new boolean form control to keep track of checked decors
				decors.forEach( ( decor: Decor ) =>
				{
					const control = this.formBuilder.control<boolean>( false );

					// On boolean value change, update checked decor
					this.formChangeSubscription = control.valueChanges.subscribe( {
						next: ( isChecked: boolean | null ) =>
						{
							this.eventBusService.setCheckedDecor( decor, isChecked ?? false );
						}
					} );

					this.form?.addControl( decor.label, control );
				} );
			}
		} );

		// Subscribe to decor change, returns a value as soon as it's subscribed to
		this.checkedDecorChangeSubscription = this.eventBusService.onCheckedDecorChange().subscribe( {
			next: ( decors: Decor[] ) =>
			{
				if ( decors.length ) {
					this.overpassTurboService.fetchOverpassTurboResults( decors );
				} else {
					this.mapService.clearMarkers();
				}
			}
		} );
	}

	public ngOnDestroy(): void
	{
		this.eventBusService.uncheckedAllDecors();
		this.eventBusService.clearOverpassTurboResults();

		this.getDecorSubscription?.unsubscribe();
		this.formChangeSubscription?.unsubscribe();
		this.checkedDecorChangeSubscription?.unsubscribe();
	}
}
