import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'text-tag',
	styles: [],
	templateUrl: './text-tag.component.html'

})

export class TextTagComponent {
	@Input() closable: boolean;
	@Input() title: string;
	@Input() prop: string;
	@Output() triggerClose: EventEmitter<boolean> = new EventEmitter<boolean>();
	
	ngOnChanges() {
	}

	triggerCloseTag() {
		this.triggerClose.emit(true);
	}
}