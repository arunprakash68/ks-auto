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
	searchTags: any;

	constructor() {
		this.isCollapsed = false;
		this.staticBillingTab = {
			active: true
		};
		this.formData = {};
		this.searchOptions = {};
		this.searchTags = [];
	}

	triggerFilterCollapse(collapse: boolean) {
		this.isCollapsed = !this.isCollapsed;
	}

	updateSearchOptions(_searchOptions: any) {
		this.searchOptions = _searchOptions;
		
		this.updateSearchTags()
		this.triggerFilterCollapse(true)
	}

	updateSearchTags(){
		let obj = this.searchOptions;
		this.searchTags = Object.keys(obj).reduce(function(filtered, option) {
			if (obj[option] != '' && option != 'start_count') {
			   let tag = { 
				   closable: true, 
				   prop: option,
				   title: obj[option]
				}
			   filtered.push(tag);
			}
			return filtered;
		}, []);
	}

	triggerCloseTag(tag) {
		if (tag.prop == 'business') {
			this.searchTags.length = 0;
			let count = this.searchOptions.start_count;
			this.searchOptions = {
				start_count : count
			}
		} 
		else{
			for(let i = 0; i <  this.searchTags.length; i++) {
				if(this.searchTags[i].prop == tag.prop) {
					this.searchTags.splice(i,1);
					break;
				}
			}
			let temp =  JSON.parse(JSON.stringify(this.searchOptions));
			temp[tag.prop] = '';
			this.searchOptions = temp;

			if (tag.prop == 'project') {
				this.triggerCloseTag({prop: 'zone'});
			}
		}
	}


}