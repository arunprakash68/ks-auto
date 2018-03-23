import { Component, Input } from '@angular/core';

@Component({
	selector: 'img-text-box',
	styles: [],
	templateUrl: './img-text-box.component.html'

})

export class ImageTextBoxComponent {
	@Input() imgSource: string;
	@Input() imgTitle: string;
	@Input() isText: boolean;
	@Input() textString: string;
	
	ngOnChanges() {
	}
}