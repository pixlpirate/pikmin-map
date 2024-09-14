import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AdvancedOptionsService } from '@services';

@Component({
	selector: 'app-advanced-options',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, TranslateModule],
	templateUrl: './advanced-options.component.html',
	styleUrls: ['./advanced-options.component.scss'],
})
export class AdvancedOptionsComponent implements OnInit, OnDestroy {
	public form?: FormGroup;
	private subscriptions: Subscription[] = [];

	constructor(private advancedOptionsService: AdvancedOptionsService) {}

	public ngOnInit(): void {
		const opt = this.advancedOptionsService;

		this.form = new FormGroup({
			hideMarkers: new FormControl(opt.hideMarkers),
			hidePaths: new FormControl(opt.hidePaths),
			showDecorRadius: new FormControl(opt.showDecorRadius),
			decorRadiusSize: new FormControl(opt.decorRadiusSize),
		});

		const form$ = this.form.valueChanges.subscribe((values) => {
			opt.hideMarkers = values.hideMarkers;
			opt.hidePaths = values.hidePaths;
			opt.showDecorRadius = values.showDecorRadius;
			opt.decorRadiusSize = values.decorRadiusSize;
		});
		this.subscriptions.push(form$);
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) =>
			subscription.unsubscribe()
		);
	}
}
