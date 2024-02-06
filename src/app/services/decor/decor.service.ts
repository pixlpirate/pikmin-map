import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, tap } from 'rxjs';

import { Decor } from '../../models';

@Injectable( {
	providedIn: 'root'
} )
export class DecorService
{
	private decors$: BehaviorSubject<Decor[]> = new BehaviorSubject<Decor[]>( [] );

	constructor (
		private http: HttpClient
	) { }

	/* Decors
	--------------------------------------------- */
	/**
	 * Loads decors from JSON file
	 * @returns {Observable<Decor[]>} - An Observable that emits an array of Decor objects.
	 */
	private loadDecors(): Observable<Decor[]>
	{
		return this.http.get<Decor[]>( "./assets/decors/decors.json" ).pipe(
			tap( ( decors: Decor[] ) =>
			{
				this.decors$.next( decors );
			} )
		);
	}

	/**
	 * Returns an Observable of decors.
	 * Loads the decors if not already loaded.
	 * @returns {Observable<Decor[]>} - An Observable that emits an array of Decor objects.
	 */
	public getDecors(): Observable<Decor[]>
	{
		if ( !this.decors$.getValue().length ) {
			return this.loadDecors();
		} else {
			return this.decors$;
		}
	}
}