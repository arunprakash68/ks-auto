import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ServerListService } from '../../../_services/servers-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'server-summary-list',
	styles: [],
	providers: [ServerListService, ErrorHandlerService],
	templateUrl: './summary-list.component.html'
})

export class ServerSummaryListComponent {
	serverSummaryParams: any;
	config: any;
	serverSummary: any;
	pagination: any;
	loading: boolean;
	summaryCallError: boolean;
	@Output() serverListParamsOut: EventEmitter<any> = new EventEmitter<any>();

	constructor(private serverListService: ServerListService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router){

		this.pagination = {
			page: 1,
			pageSize: 6,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};
		this.serverSummaryParams = {
			s_count: 0,
			e_count: 6
		}
		this.loading = true;
		this.getServerSummary();
	}

	ngOnInit() {
		
	}

	showDetailedView(params) {
		this.serverListParamsOut.emit(params);
	}

	checkZeroValue(val) {
		if(val && val > 0) {
			return val;
		}
		return '-';
	}

	getServerSummary() {
		// if(this.serverSummary) return;
		this.loading = true;
		this.summaryCallError = false;
		
		this.serverListService.getMyServersSummary(this.serverSummaryParams).subscribe(data => {
			this.loading = false;
			
			if(data && data['status'] == 1) {
				this.serverSummary = data;
				this.updatePaginationParameters();
			} else {
				this.serverSummary = null;
				this.summaryCallError = true;	
			}
			
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.serverSummary = null;
			this.loading = false;
			this.summaryCallError = true;
		});
		
	}

	updatePaginationParameters() {
		// if(this.serverSummary['status'] == 0) { return; }
		this.pagination.collectionSize = this.serverSummary['count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	pageChange(currPage){
		this.pagination.page = currPage;
		this.serverSummaryParams['s_count'] = (currPage - 1) * this.pagination.pageSize;
		this.serverSummaryParams['e_count'] = this.pagination.pageSize;
		this.getServerSummary();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.summaryCallError) {
			return false;	
		}
		if(this.showNoSummaryMsg()) {
			return false;
		}
		return true;
	}

	showNoSummaryMsg() {
		return (this.serverSummary && !(this.serverSummary.status == 1)) || (this.serverSummary && (this.serverSummary.summary.length == 0));
	}

}
