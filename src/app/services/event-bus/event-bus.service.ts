import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Decor, OverpassTurboResult } from '@interfaces';

@Injectable( {
	providedIn: 'root'
} )
export class EventBusService
{
	private overpassResults$: BehaviorSubject<OverpassTurboResult[]> = new BehaviorSubject<OverpassTurboResult[]>( [] );
	private checkedDecors$: BehaviorSubject<Decor[]> = new BehaviorSubject<Decor[]>( [] );
	private mapChange$: BehaviorSubject<void> = new BehaviorSubject<void>( undefined );

	constructor () { }

	/* Overpass Turbo Results
	--------------------------------------------- */
	/**
	 * Returns the overpass results subject.
	 * @returns {BehaviorSubject<OverpassTurboResult[]>} - The overpass results subject.
	 */
	public onOverpassTurboResultsChange(): BehaviorSubject<OverpassTurboResult[]>
	{
		return this.overpassResults$;
	}

	/**
	 * Updates the overpass results subject.
	 * @param results - The new overpass turbo results.
	 * @returns void
	 */
	public setOverpassTurboResults( results: OverpassTurboResult[] ): void
	{
		this.overpassResults$.next( results );
	}

	/**
	 * Returns the overpass results.
	 *
	 * @returns {OverpassTurboResult[]} - An array of OverpassTurboResult objects.
	 */
	public getOverpassTurboResults(): OverpassTurboResult[]
	{
		return this.overpassResults$.getValue();
	}

	public clearOverpassTurboResults(): void
	{
		this.overpassResults$.next( [] );
	}


	/* Decors
	--------------------------------------------- */
	/**
	 * Updates the checked decors subject.
	 *
	 * @param {Decor} decor - The decor to check or uncheck.
	 * @param {boolean} isChecked - Whether the decor is checked or not.
	 */
	public setCheckedDecor( decor: Decor, isChecked: boolean ): void
	{
		this.checkedDecors$.next( isChecked
			? [ ...this.checkedDecors$.getValue(), decor ] // Add decor to array
			: this.checkedDecors$.getValue().filter( d => d !== decor ) // Remove decor from array
		);
	}

	/**
	 * Observable that fires when the checked decors change.
	 *
	 * @returns {Observable<Decor[]>} - An Observable that emits an array of Decor objects.
	 */
	public onCheckedDecorChange(): BehaviorSubject<Decor[]>
	{
		return this.checkedDecors$;
	}

	/**
	 * Returns the checked decors.
	 *
	 * @returns {Decor[]} - An array of Decor objects.
	 */
	public getCheckedDecors(): Decor[]
	{
		return this.checkedDecors$.getValue();
	}

	/**
	 * Unchecks all decors.
	 *
	 * @returns void
	 */
	public uncheckedAllDecors(): void
	{
		this.checkedDecors$.next( [] );
	}


	/* Map
	--------------------------------------------- */
	/**
	 * Triggers a map change event (e.g. zoom, move-end).
	 *
	 * @returns void
	 */
	public setMapChange(): void
	{
		this.mapChange$.next();
	}

	/**
	 * Observable that fires when the map changes.
	 *
	 * @returns {Observable<void>} - A void Observable
	 */
	public onMapChange(): BehaviorSubject<void>
	{
		return this.mapChange$;
	}

}
