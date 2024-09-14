import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { ToastComponent } from '@components';
import { ToastService } from '@services';
import { Toast } from '@interfaces';

/**
 * The toast container component used to display toasts.
 * It can contain multiple ToastComponent
 */
@Component({
	selector: 'app-toast-container',
	standalone: true,
	imports: [CommonModule, ToastComponent],
	templateUrl: './toast-container.component.html',
	styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent implements OnInit, OnDestroy {
	public toasts: Toast[] = [];

	private toastSubscription?: Subscription;

	constructor(private toastService: ToastService) {}

	public ngOnInit(): void {
		this.toastSubscription = this.toastService
			.listen()
			.subscribe((toasts: Toast[]) => {
				this.toasts = toasts;
			});
	}

	public ngOnDestroy(): void {
		this.toastSubscription?.unsubscribe();
	}
}
