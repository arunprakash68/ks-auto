import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IServerData, ServerListService } from '../../../_services/servers-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { ServerUpdateFormComponent } from '../server-update-form/server-update-form.component';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'servers-list',
	styles: [],
	providers: [ServerListService, ErrorHandlerService],
	templateUrl: './servers-list.component.html'
})

export class ServerslistComponent {
	@Input() serverSearchParams: any;
	@Output() triggerDynamicAlertsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() triggerDynamicStatsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() selectedServerData: EventEmitter<any> = new EventEmitter<any>();
	config: any;
	servers: any;
	page: number;
	pageSize: number;
	maxSize: number;
	rotate: boolean;
	boundaryLinks: boolean;
	pageItemIndex: number;
	collectionSize: number;
	loading: boolean;
	serverCallError: boolean;
	serverToEdit: any;

	constructor(private serverListService: ServerListService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router){
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
				},
				vmStatusDisplay: {
					production: 'prod',
					staging: 'staging',
					qa: 'qa',
					dr: 'dr',
					preprod: 'pre prod',
					'pre%20prod': 'pre prod',
					'pre prod': 'pre prod'
				},
				vmStatusDisplayClass: {
					production: 'prod',
					staging: 'staging',
					qa: 'qa',
					dr: 'dr',
					preprod: 'preprod',
					'pre%20prod': 'preprod',
					'pre prod': 'preprod',
					nostatus : 'N/A'
				},
				vmStatusValue: {
					production: 'Production',
					staging: 'Staging',
					qa: 'QA',
					dr: 'DR',
					'pre prod': 'Pre Prod'	
				}
			},
			status: {
				'up': '<i class="fa fa-circle green-circle"></i>',
				'down': '<i class="fa fa-circle red-circle"></i>'
			},
			location: {
				'mumbai': '<label class="label-location location-mumbai" title="mumbai">mumb</label>',
				'chennai': '<label class="label-location location-chennai" title="chennai">chen</label>',
				'singapore': '<label class="label-location location-singapore" title="singapore">sing</label>'
			}
		};
	}

	ngOnChanges() {
		// this.getMyServers();
		// const searchValue = this.activatedRoute.snapshot.paramMap.get('searchValue');
		// console.log(searchValue);
		// if(searchValue) {
		// 	this.pageChange(1, searchValue);	
		// } else {
			this.pageChange(1);	
		// }
	}

	getMyServers() {
		this.loading = true; 
		this.serverCallError = false;
		this.servers = null;
		console.log(this.serverSearchParams);
		this.serverListService.getMyServers(this.serverSearchParams).subscribe(data => {
			
			if (data && data['status'] != 0 && data['vmdata'] && data['vmdata'].length > 0) {
				console.log(data);
				this.servers = data;
				this.updatePaginationParameters();
			}
			this.loading = false;
		},
		error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.loading = false;  
				this.router.navigate(['/login']);
			}
			this.servers = null;
			this.loading = false;
			this.serverCallError = true;
		}) 
	}

	updatePaginationParameters() {
		if(this.servers['status'] == '0') { return; }
		this.collectionSize = this.servers['count'];
		this.pageItemIndex = (this.page - 1) * this.pageSize;
	}

	pageChange(currPage, searchValue?){
		this.page = currPage;
		this.serverSearchParams['start_count'] = (this.page - 1) * this.pageSize;
		this.serverSearchParams['end_count'] = this.pageSize;
		// if (searchValue) {
		// 	this.serverSearchParams['search_value'] = searchValue;
		// }
		this.getMyServers();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.serverCallError) {
			return false;	
		}
		if(this.showNoServersMsg()) {
			return false;
		}
		return this.servers != null;
	}

	showNoServersMsg() {
		if(!this.servers && !this.loading && !this.serverCallError) return true;
		return (this.servers && !(this.servers.status == '1'));
	}

	openDynamicAlertsTab(serverData) {
		this.selectedServerData.emit(serverData);
		this.triggerDynamicAlertsTab.emit(true);	
	}

	openDynamicStatsTab(serverData) {
		this.selectedServerData.emit(serverData);
		this.triggerDynamicStatsTab.emit(true);
	}

	editServerData(serverUpdateModal, serverData) {
		this.serverToEdit = serverData;
		serverUpdateModal.show();
	}

	reloadServerList(serverUpdateModal) {
		serverUpdateModal.hide();
		this.getMyServers();
	}

	errorHandler(event) {
		console.log(event);
		console.debug(event);
		event.target.src = "https://cdn.browshot.com/static/images/not-found.png";
	}

}
