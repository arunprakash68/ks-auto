import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IStorageData, StorageListService } from '../../../_services/storage-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'storage-list',
	styles: [],
	providers: [StorageListService, ErrorHandlerService],
	templateUrl: './storage-list.component.html'
})

export class StoragelistComponent {
	@Input() serverSearchParams: any;
	@Output() triggerDynamicAlertsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() triggerDynamicStatsTab: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() selectedServerData: EventEmitter<any> = new EventEmitter<any>();
	config: any;
	storages: any;
	page: number;
	pageSize: number;
	maxSize: number;
	rotate: boolean;
	boundaryLinks: boolean;
	pageItemIndex: number;
	collectionSize: number;
	loading: boolean;
	storageCallError: boolean;

	constructor(private storageListService: StorageListService, 
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
			typeImagePath: 'http://keystoneold.timesinternet.in/assets/img/storage',
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
				'chennai': '<label class="label-location location-chennai">chennai</label>',
				'netmagic': '<label class="label-location location-netmagic">netmagic</label>',
				'vsnl': '<label class="label-location location-vsnl">vsnl</label>',
			}
		};
	}

	ngOnChanges() {
		this.getMyStorages();
	}

	getMyStorages() {
		this.loading = true; 
		this.storageCallError = false;
		this.storages = null;
		this.storageListService.getMyStorages(this.serverSearchParams).subscribe(data => {
			this.loading = false;  
			
			if (data && data['status'] != 0) {
				this.storages = data;
				this.updatePaginationParameters();
			} else {
				this.storageCallError = true; 		
			}
		},
		error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.storages = null;
			this.loading = false;
			this.storageCallError = true;
		}) 
	}

	updatePaginationParameters() {
		if(this.storages['status'] == '0') { return; }
		this.collectionSize = this.storages['count'];
		// this.collectionSize = 16;
		this.pageItemIndex = (this.page - 1) * this.pageSize;
	}

	pageChange(currPage){
		this.page = currPage;
		this.serverSearchParams['start_count'] = (this.page - 1) * this.pageSize;
		this.getMyStorages();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.storageCallError) {
			return false;	
		}
		if(this.showNoServersMsg()) {
			return false;
		}
		return true;
	}

	showNoServersMsg() {
		// return (this.storages && !(this.storages.status == '1'));
		return (!this.loading && !this.storageCallError && (!this.storages || (this.storages && (this.storages.length < 1))));
	}

	openDynamicAlertsTab(serverData) {
		this.selectedServerData.emit(serverData);
		this.triggerDynamicAlertsTab.emit(true);	
	}

	openDynamicStatsTab(serverData) {
		this.selectedServerData.emit(serverData);
		this.triggerDynamicStatsTab.emit(true);
	}

	errorHandler(event) {
		console.log(event);
		console.debug(event);
		event.target.src = "https://cdn.browshot.com/static/images/not-found.png";
	}

}
