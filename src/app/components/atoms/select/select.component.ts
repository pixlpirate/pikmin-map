import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { ClickOutsideDirective } from '@directives';
import { SelectOption } from '@interfaces';

@Component({
	selector: 'app-select',
	standalone: true,
	imports: [CommonModule, TranslateModule, ClickOutsideDirective],
	templateUrl: './select.component.html',
	styleUrl: './select.component.scss'
})
export class SelectComponent {
	@Input() public ariaLabel: string = 'Select an option';
	@Input() public options: SelectOption[] = [];
	@Input() public value?: string;
	@Output() public valueChange = new EventEmitter<string>();

	public isOpen: boolean = false;

	public toggle(): void {
		this.isOpen = !this.isOpen;
	}

	public close(): void {
		this.isOpen = false;
	}

	public select(value: string): void {
		if (this.value === value) {
			this.close();
			return;
		}

		this.value = value;
		this.valueChange.emit(value);
		this.close();
	}

	public getSelectedOption(): SelectOption | undefined {
		return this.options.find((option: SelectOption) => option.value === this.value);
	}

}
