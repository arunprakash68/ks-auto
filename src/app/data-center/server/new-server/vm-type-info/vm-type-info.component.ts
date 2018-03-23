import { Component, Input } from '@angular/core';

@Component({
	selector: 'vm-type-info',
	styles: [],
	templateUrl: './vm-type-info.component.html'

})

export class VMTypeInfoComponent {
	@Input() vmTypeInfo: any;
	
	
	ngOnChanges() {
	}
}