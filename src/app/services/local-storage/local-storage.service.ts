import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	constructor() {}

	/**
	 * Retrieves an item from local storage.
	 * @param key - The key of the item to retrieve from local storage.
	 * @returns {any} - The item from local storage, or null if the item does not exist.
	 */
	public getItem(key: string): any {
		const item = localStorage.getItem(key);
		if (item) {
			return JSON.parse(item);
		}
		return null;
	}

	/**
	 * Stores an object in local storage.
	 * @param key - The key under which to store the item.
	 * @param value - The item to store in local storage.
	 * @returns void
	 */
	public setItem(key: string, value: any): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	/**
	 * Removes an item from local storage.
	 * @param key - The key of the item to remove from local storage.
	 * @returns void
	 */
	public removeItem(key: string): void {
		localStorage.removeItem(key);
	}
}
