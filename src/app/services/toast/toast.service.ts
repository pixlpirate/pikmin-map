import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { NewToast, Toast } from '@interfaces';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	private toasts: Toast[] = [];
	private toasts$ = new Subject<Toast[]>();

	constructor() {}

	/**
	 * Create new toast and add it to the currently active toasts
	 *
	 * @param toast - The toast object to be added
	 *
	 * @returns number - toast.id
	 */
	public add(toast: NewToast): number {
		toast.duration = toast.duration || 4000;
		toast.id = toast.id ? toast.id : this.generateId();
		this.toasts.push(toast as Toast);
		this.toasts$.next([...this.toasts]);
		return toast.id;
	}

	/**
	 * Removes a toast from the currently active toasts
	 *
	 * @param id - The id of the toast to be removed
	 *
	 * @returns void
	 */
	public remove(id: Number): void {
		this.toasts = this.toasts.filter((t) => t.id !== id);
		this.toasts$.next([...this.toasts]);
	}

	/**
	 * Removes all toasts from the currently active toasts
	 *
	 * @returns void
	 */
	public removeAll(): void {
		this.toasts = [];
		this.toasts$.next([...this.toasts]);
	}

	/**
	 * Returns all currently active toasts
	 *
	 * @returns Toast[] - An array of currently active toasts
	 */
	public get(): Toast[] {
		return [...this.toasts];
	}

	/**
	 * Returns an observable of the currently active toasts
	 *
	 * @returns Subject<Toast[]> - An observable of the currently active toasts
	 */
	public listen(): Subject<Toast[]> {
		return this.toasts$;
	}

	/**
	 * Generates a random id for a new toast
	 *
	 * @returns number - A random id
	 */
	private generateId(): number {
		const id: number = Math.floor(Math.random() * 256);
		return this.toasts.find((t) => t.id === id) ? this.generateId() : id;
	}
}
