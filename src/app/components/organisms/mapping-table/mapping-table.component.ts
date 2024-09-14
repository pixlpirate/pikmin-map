import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DecorService } from '@services';
import { Decor } from '@interfaces';

@Component({
	selector: 'app-mapping-table',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './mapping-table.component.html',
	styleUrl: './mapping-table.component.scss',
})
export class MappingTableComponent {
	public decors?: Decor[];

	constructor(
		private translateService: TranslateService,
		private decorService: DecorService
	) {}

	/* Angular lifecycle
	--------------------------------------------- */
	public ngOnInit(): void {
		this.decorService.getDecors().subscribe((decors: Decor[]) => {
			this.decors = decors;
		});
	}

	/* Tag mapping
	--------------------------------------------- */
	public getDecorTags(tags: string[] | string[][]): string[] {
		if (!tags || tags.length === 0) return [];

		if (typeof tags[0] === 'string') {
			return tags as string[];
		}

		return (tags as string[][]).map((tag: string[]) => {
			return tag.join(
				this.translateService.instant(
					' <b>' + this.translateService.instant('AND') + '</b> '
				)
			);
		});
	}
}
