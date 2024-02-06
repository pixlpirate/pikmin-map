import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

import { ToastService } from '../../../services';

export type AnimationState = 'in' | 'out' | 'void';

/**
 * The toast messages displayed at the bottom right of the screen and used to display errors and other messages.
 * Also used to display the loading spinner.
 */
@Component( {
	selector: 'app-toast',
	standalone: true,
	imports: [],
	templateUrl: './toast.component.html',
	styleUrl: './toast.component.scss',
	animations: [
		trigger( 'slideInOut', [
			state( 'void', style( {
				transform: 'translateX(50%)',
				opacity: 0
			} ) ),
			state( 'in', style( {
				transform: 'translateX(0)',
				opacity: 1
			} ) ),
			state( 'out', style( {
				transform: 'translateX(50%)',
				opacity: 0
			} ) )
		] )
	]
} )
export class ToastComponent implements OnInit
{
	@Input() id: number = 0;
	@Input() message: string = '';
	@Input() type: string = 'info';
	@Input() duration?: number;

	public percentage: number = 0;
	private remaining: number = 0;
	private interval: number = 25;

	public transitionDuration = 500;
	public state: AnimationState = 'void';

	constructor (
		private toastService: ToastService
	) { }

	ngOnInit(): void
	{
		setTimeout( () => this.slideIn(), 0 );

		if ( this.duration ) {
			this.remaining = this.duration;
			const interval = setInterval( () =>
			{
				this.remaining = this.duration ? this.remaining - this.interval : 0;
				this.percentage = this.duration ? 100 - ( this.remaining / this.duration * 100 ) : 0;

				if ( this.remaining <= 0 ) {
					clearInterval( interval );
					this.close();
				}

			}, this.interval );
		}
	}

	public close(): void
	{
		this.slideOut();
		setTimeout( () =>
		{
			this.toastService.remove( this.id );
		}, this.transitionDuration );
	}

	private slideIn()
	{
		this.state = 'in';
	}

	private slideOut()
	{
		this.state = 'out';
	}
}
