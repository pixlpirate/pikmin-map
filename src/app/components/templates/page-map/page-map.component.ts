import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { DecorSelectionComponent, MapComponent } from '@components';
import { EventBusService, OverpassTurboService } from '@services';

/**
 * The map page component used to display the map and the decor selection.
 */
@Component({
	selector: 'app-page-map',
	standalone: true,
	imports: [DecorSelectionComponent, MapComponent, RouterLink],
	templateUrl: './page-map.component.html',
	styleUrl: './page-map.component.scss',
})
export class PageMapComponent implements OnInit, OnDestroy {
	private mapChangeSubscription?: Subscription;

	constructor(
		private overpassTurboService: OverpassTurboService,
		private eventBusService: EventBusService,
	) {}

	/* Angular Lifecycle
	--------------------------------------------- */
	public ngOnInit(): void {
		// On map move or zoom, update overpass results
		this.eventBusService.onMapChange().subscribe({
			next: () => {
				const checkedDecors = this.eventBusService.getCheckedDecors();
				if (checkedDecors.length > 0) {
					this.overpassTurboService.fetchOverpassTurboResults(
						checkedDecors,
					);
				}
			},
		});
	}

	public ngOnDestroy(): void {
		this.mapChangeSubscription?.unsubscribe();
	}
}
