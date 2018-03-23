import { Component } from '@angular/core';

@Component({
	selector: 'physical-billing',
	styles: [],
	templateUrl: './physical-billing.component.html'
})

export class PhysicalBillingComponent {
	staticBillingTab: any;
	searchOptions: any;
	isCollapsed: boolean;
	dateSelector: any;
	formData: any;

	constructor() {
		this.isCollapsed = false;
		this.staticBillingTab = {
			active: true
		};
		this.formData = {};
		this.searchOptions = {};
		this.initForm();
	}

	initForm() {
		const currentDate = new Date();
		const currentYear = currentDate.getUTCFullYear();
		// this.dateSelector = {
		// 	years: [currentYear - 1, currentYear],
		// 	months: [
		// 		{value: 1, name: 'January'},
		// 		{value: 2, name: 'February'},
		// 		{value: 3, name: 'March'},
		// 		{value: 4, name: 'April'},
		// 		{value: 5, name: 'May'},
		// 		{value: 6, name: 'June'},
		// 		{value: 7, name: 'July'},
		// 		{value: 8, name: 'August'},
		// 		{value: 9, name: 'September'},
		// 		{value: 10, name: 'October'},
		// 		{value: 11, name: 'November'},
		// 		{value: 12, name: 'December'}
		// 	],
		// 	yearMonths: {}
		// };
		
		// for(let i = 0; i < 2; i++) {
		// 	if(!this.dateSelector['yearMonths'][currentYear - i]) {
		// 		this.dateSelector['yearMonths'][currentYear - i] = [];
		// 	}
		// 	for(let j = 0; j < this.dateSelector['months'].length; j++) {
		// 		if(i > 0 || (i == 0 && j <= (currentDate.getUTCMonth()))) {
		// 			this.dateSelector['yearMonths'][currentYear - i].push(this.dateSelector['months'][j]);	
		// 		}
		// 	}
		// }
		// this.formData.year = currentYear;
		// this.formData.month = currentDate.getUTCMonth() + 1;
		// this.dateChange();
	}

	triggerFilterCollapse(collapse: boolean) {
		this.isCollapsed = !this.isCollapsed;
	}

	updateSearchOptions(_searchOptions: any) {
		this.searchOptions = _searchOptions;
	}

	// yearChange() {
	// 	if(this.dateSelector.yearMonths[this.formData.year].indexOf(this.formData['month']) > -1) {
	// 		return;
	// 	}
	// 	this.formData['month'] = this.dateSelector.yearMonths[this.formData.year][0]['value'];
	// 	this.dateChange();
	// }

	// dateChange() {
	// 	console.log(this.formData);
	// 	this.searchOptions['year'] = this.formData['year'];
	// 	this.searchOptions['month'] = this.formData['month'];
	// 	this.searchOptions['bu_value'] = '';
	// 	this.searchOptions['project_value'] = '';
	// 	let newSearchoptions = {};
	// 	for(let prop in this.searchOptions) {
	// 		if(this.searchOptions[prop]) {
	// 			newSearchoptions[prop] = this.searchOptions[prop];
	// 		}
	// 	}
	// 	this.updateSearchOptions(newSearchoptions);
	// }

}