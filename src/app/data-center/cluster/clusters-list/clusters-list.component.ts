import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IClusterData, ClusterListService } from '../../../_services/clusters-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'clusters-list',
	styles: [],
	providers: [ClusterListService, ErrorHandlerService],
	templateUrl: './clusters-list.component.html'
})

export class ClusterslistComponent {
	@Input() clusterSearchParams: any;
	@Output() triggerDynamicAlertsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() triggerDynamicStatsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() selectedClusterData: EventEmitter<any> = new EventEmitter<any>();
	config: any;
	clusters: any;
	page: number;
	pageSize: number;
	maxSize: number;
	rotate: boolean;
	boundaryLinks: boolean;
	pageItemIndex: number;
	collectionSize: number;
	loading: boolean;
	clusterCallError: boolean;

	constructor(private clusterListService: ClusterListService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
		this.page = 1;
		this.pageSize = 16;
		this.maxSize = 5;
		this.rotate = true;
		this.boundaryLinks = true;
		this.pageItemIndex = 0;
		this.loading = true;
		this.collectionSize = 0;
		this.config = {
			osImagePath: 'http://keystoneold.timesinternet.in/assets/img/os-images/',
			vmTypeImagePath: 'http://keystoneold.timesinternet.in/assets/img/tepmlate/',
			tags: {
				monitorStatus: {
					'1': 'non prod',
					'2': 'prod',
					'3': 'dr',
					'4': 'pre prod'
				}
			},
			status: {
				'up': '<i class="fa fa-circle green-circle"></i>',
				'down': '<i class="fa fa-circle red-circle"></i>'
			},
			location: {
				'mumbai': '<label class="label-location location-mumbai">mumbai</label>',
				'chennai': '<label class="label-location location-chennai">chennai</label>'
			}
		};
	}

	ngOnChanges() {
		this.getMyServers();
	}

	getMyServers() {
		this.loading = true; 
		this.clusterCallError = false;
		this.clusters = null;
		this.clusterListService.getMyClusters(this.clusterSearchParams).subscribe(data => {
			
			if (data && data['status'] != 0 && data['vmdata'] && data['vmdata'].length > 0 && data['vmdata'][0]['hostname']) {
				console.log(data);
				this.clusters = data;
				this.updatePaginationParameters();
			}
			this.loading = false;
		},
		error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.loading = false;  
				this.router.navigate(['/login']);
			}
			this.clusters = null;
			this.loading = false;
			this.clusterCallError = true;
		}) 
	}

	updatePaginationParameters() {
		if(this.clusters['status'] == '0') { return; }
		this.collectionSize = this.clusters['count'];
		this.pageItemIndex = (this.page - 1) * this.pageSize;
	}

	pageChange(currPage){
		this.page = currPage;
		this.clusterSearchParams['start_count'] = (this.page - 1) * this.pageSize;
		this.getMyServers();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.clusterCallError) {
			return false;	
		}
		if(this.showNoServersMsg()) {
			return false;
		}
		return this.clusters != null;
	}

	showNoServersMsg() {
		if(!this.clusters && !this.loading && !this.clusterCallError) return true;
		return (this.clusters && !(this.clusters.status == '1'));
	}

	openDynamicAlertsTab(serverData) {
		this.selectedClusterData.emit(serverData);
		this.triggerDynamicAlertsTab.emit(true);	
	}

	openDynamicStatsTab(serverData) {
		this.selectedClusterData.emit(serverData);
		this.triggerDynamicStatsTab.emit(true);
	}

	errorHandler(event) {
		console.log(event);
		console.debug(event);
		event.target.src = "https://cdn.browshot.com/static/images/not-found.png";
	}

}
