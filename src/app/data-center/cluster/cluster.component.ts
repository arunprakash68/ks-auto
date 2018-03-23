import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoragelistComponent } from '../storage/storage-list/storage-list.component';
import { ClusterFilterFormComponent } from './cluster-filter-form/cluster-filter-form.component';
import { ServerStatsComponent } from '../server/server-stats/server-stats.component';

@Component({
	selector: 'data-center-cluster',
	styles: [],
	templateUrl: './cluster.component.html'
})

export class DataCenterClusterComponent {
	staticClusterTab: any;
	dynamicTabs: any[];
	config: any;
	pageSize: number;
	page: number;
	maxSize: number;
	rotate: boolean;
	collectionSize: number;
	boundaryLinks: boolean;
	pageItemIndex: number;
	isCollapsed: boolean;
	searchOptions: any;
	searchTags: any;
	loading: boolean;
	callResize: boolean;
	selectedClusterData: any;

	constructor(private cdRef:ChangeDetectorRef) {
		this.isCollapsed = false;
		this.searchOptions = {};
		this.searchTags = [];
		this.dynamicTabs = [];
		this.staticClusterTab = {
			active: true
		};
	}

	ngAfterViewChecked()
	{
		this.cdRef.detectChanges();
	}

	ngOnInit(){
	}

	addDynamicTab(options) {
		this.staticClusterTab['active'] = false;
		const newTabIndex = this.dynamicTabs.length + 1;
		options['disabled'] = false;
		options['removable'] = true;
		this.dynamicTabs.push(options);
		this.dynamicTabs[newTabIndex - 1].active = true;
		document.body.scrollTop = 0;
	}

	openDynamicAlertsTab(triggerAlertsTab) {
		var options = {
			title: this.selectedClusterData['hostname'],
			tabType: 'alerts',
			clusterAlertsParams: {
				host: this.selectedClusterData['ip']  
			}
		};
		this.addDynamicTab(options);
	}

	openDynamicStatsTab(triggerStatsTab) {
		if(!triggerStatsTab) return;
		var options = {
			title: this.selectedClusterData['hostname'],
			tabType: 'stats',
			graphDataParams: {
				ip: this.selectedClusterData['ip']
			}
		}
		this.addDynamicTab(options);
	}

	selectCluster(clusterData) {
		this.selectedClusterData = clusterData;
	}

	removeTabHandler(tab:any): void {
		const tabIndex = this.dynamicTabs.indexOf(tab);
		this.dynamicTabs.splice(tabIndex, 1);
		if (tabIndex == 0) {
			this.staticClusterTab['active'] = true;
		} else {
			this.dynamicTabs[tabIndex - 1].active = true;   
		}
	}


	updateSearchOptions(_searchOptions: any): void {
		this.isCollapsed = !this.isCollapsed;
		this.searchOptions = _searchOptions;
		this.updateSearchTags();
	}

	triggerCloseTag(tag) {
		for(let i = 0; i <  this.searchTags.length; i++) {
			if(this.searchTags[i].prop == tag.prop) {
				this.searchTags.splice(i,1);
				break;
			}
		}
		let temp =  JSON.parse(JSON.stringify(this.searchOptions));
		temp[tag.prop] = '';
		this.searchOptions = temp;
	}

	updateSearchTags() {
		this.searchTags = [];
		let tagPool = {
			search_value: true,
			business: true,
			project: true,
			env: {
				'2': 'prod',
				'1': 'non prod',
				'3': 'dr',
				'4': 'pre prod'
			},
			health: {
				'2': 'bad',
				'1': 'alert',
				'3': 'good'
			},
			location: {
				'2': 'mumbai',
				'3': 'chennai'
			}
		}
		for(let prop in this.searchOptions) {
			let title = '';
			if(tagPool[prop] && this.searchOptions[prop] != '') {
				switch (prop) {
					case "env":
					title = tagPool['env'][this.searchOptions[prop]];
					break;
					case "health":
					title = tagPool['health'][this.searchOptions[prop]];
					break;
					case "location":
					title = tagPool['location'][this.searchOptions[prop]];
					break;  
					default:
					title = this.searchOptions[prop];
					break;
				}
				this.searchTags.push({
					title: title,
					prop: prop,
					closable: true
				});
			}

		}

	}

	openClusterFilter(){
		this.isCollapsed = !this.isCollapsed;
	}
}