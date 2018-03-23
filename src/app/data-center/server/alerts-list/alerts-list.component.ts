import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ServerAlertsService } from '../../../_services/server-alerts.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'server-alerts-list',
	styles: [],
	providers: [ServerAlertsService, ErrorHandlerService],
	templateUrl: './alerts-list.component.html'
})

export class ServerAlertslistComponent {
	@Input() serverAlertsParams: any;
	config: any;
	serverAlerts: any;
	page: number;
	pageSize: number;
	maxSize: number;
	rotate: boolean;
	boundaryLinks: boolean;
	pageItemIndex: number;
	collectionSize: number;
	loading: boolean;
	alertsCallError: boolean;

	constructor(private serverAlertsService: ServerAlertsService, private errorHandlerService: ErrorHandlerService,
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
			status: {
				'ok': '<label class="label-status bg-green">ok</label>',
				'alerting': '<label class="label-status bg-red">alerting</label>',
				'no data': '<label class="label-status bg-lightblue">no data</label>'
			},
			classification: {
				'true': '<label class="label-status bg-green">True Positive</label>',
				'false': '<label class="label-status bg-red">False Positive</label>',
				'no data': 	'<label class="label-status bg-lightblue">no data</label>'
			}
		}
	}

	ngOnChanges() {
		this.getServerAlerts();
	}

	getServerAlerts() {
		this.loading = true;
		this.alertsCallError = false;
		var options = {
			host: this.serverAlertsParams['host'],
			offset: (this.page - 1) * this.pageSize
		};
		this.serverAlertsService.getServerAlerts(options).subscribe(data => {
			
			this.serverAlerts = data;
			this.loading = false;
			this.updatePaginationParameters();
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.serverAlerts = null;
			this.loading = false;
			this.alertsCallError = true;
		});
		
	}

	updatePaginationParameters() {
		if(this.serverAlerts['status'] == '0') { return; }
		this.collectionSize = this.serverAlerts['Count'];
		this.pageItemIndex = (this.page - 1) * this.pageSize;
	}

	pageChange(currPage){
		this.page = currPage;
		this.getServerAlerts();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.alertsCallError) {
			return false;	
		}
		if(this.showNoAlertsMsg()) {
			return false;
		}
		return true;
	}

	showNoAlertsMsg() {
		return (this.serverAlerts && !(this.serverAlerts.status == '1'));
	}

}
