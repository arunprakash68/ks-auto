import { Component, Input } from '@angular/core';

@Component({
	selector: 'summary-tile',
	styles: [],
	templateUrl: './summary-tile.component.html'

})

export class SummaryTileComponent {
	@Input() summaryTileInfo: any;
	@Input() tileColor: string;
	
	
	ngOnChanges() {
	}
}