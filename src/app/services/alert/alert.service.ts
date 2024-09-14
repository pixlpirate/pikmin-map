import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Alert } from '@interfaces';

@Injectable({
	providedIn: 'root',
})
export class AlertService {
	private alert: Alert | null = null;
	private alert$ = new Subject<Alert>();

	constructor() {}

	/**
	 * Set a new alert
	 *
	 * @param alert - The alert object to be set
	 *
	 * @returns void
	 */
	public set(alert: Alert): void {
		this.alert = alert;
		this.alert$.next(this.alert);
	}

	/**
	 * Unset the alert
	 *
	 * @returns void
	 */
	public unset(): void {
		this.alert = null;
	}

	/**
	 * Returns the currently set alert
	 *
	 * @returns Alert - The currently set alert
	 */
	public get(): Alert | null {
		return this.alert;
	}

	/**
	 * Returns an observable of the currently active alerts
	 *
	 * @returns Subject<Alert[]> - An observable of the currently active alerts
	 */
	public listen(): Subject<Alert> {
		return this.alert$;
	}
}
