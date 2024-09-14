import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AdvancedOptionsService {
	private options = {
		hideMarkers: false,
		hidePaths: false,
		showDecorRadius: false,
		decorRadiusSize: 100,
	};

	constructor() {
		const savedValues = JSON.parse(
			localStorage.getItem('advancedOptions') ??
				JSON.stringify(this.options)
		);
		this.options = { ...this.options, ...savedValues };
	}

	get hideMarkers(): boolean {
		return this.options.hideMarkers;
	}

	set hideMarkers(value: boolean) {
		this.options.hideMarkers = value;
		this.saveOptions();
	}

	get hidePaths(): boolean {
		return this.options.hidePaths;
	}

	set hidePaths(value: boolean) {
		this.options.hidePaths = value;
		this.saveOptions();
	}

	get showDecorRadius(): boolean {
		return this.options.showDecorRadius;
	}

	set showDecorRadius(value: boolean) {
		this.options.showDecorRadius = value;
		this.saveOptions();
	}

	get decorRadiusSize(): number {
		return this.options.decorRadiusSize;
	}

	set decorRadiusSize(value: number) {
		this.options.decorRadiusSize = value;
		this.saveOptions();
	}

	private saveOptions(): void {
		localStorage.setItem('advancedOptions', JSON.stringify(this.options));
	}
}
