import {
	Directive,
	ElementRef,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';

/**
 * Attached to a component, this directive will emit an event when a click occurs outside of the component.
 * This is useful for closing a dropdown or modal.
 *
 * @example <div appClickOutside (clickOutside)="onClickedOutside()"></div>
 */
@Directive({
	selector: '[appClickOutside]',
	standalone: true,
})
export class ClickOutsideDirective {
	@Output() clickOutside = new EventEmitter<void>();

	constructor(private elementRef: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	private onClick(target: any): void {
		const clickedInside = this.elementRef.nativeElement.contains(target);

		if (!clickedInside) {
			this.clickOutside.emit();
		}
	}
}
