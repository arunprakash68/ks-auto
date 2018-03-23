import { Component } from '@angular/core';

@Component({
	selector: 'elb',
	styles: [],
	templateUrl: './elb.component.html'
})

export class ELBComponent {
	staticBillingTab: any;
	searchOptions: any;
	isCollapsed: boolean;
	formData: any;

	constructor() {
		this.isCollapsed = false;
		this.staticBillingTab = {
			active: true
		};
		this.formData = {};
		this.searchOptions = {};
	}

	triggerFilterCollapse(collapse: boolean) {
		this.isCollapsed = !this.isCollapsed;
	}

	updateSearchOptions(_searchOptions: any) {
		this.searchOptions = _searchOptions;
		this.triggerFilterCollapse(true)
	}


}