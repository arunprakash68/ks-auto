import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ServerMonitoringService } from '../../../../_services/monitoring-service/server-monitoring.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'server-logs-list',
	styles: [],
	providers: [ServerMonitoringService, ErrorHandlerService],
	templateUrl: './logs-list.component.html'
})

export class ServerLogslistComponent {
	@Input() graphDataZoom: any;
	@Input() updatedSearchOptions: any;
	@Input() tabselected: any;
	@Output() serverLogsOut: EventEmitter<any> = new EventEmitter<any>();
	@Output() logsSearchOptions: EventEmitter<any> = new EventEmitter<any>();
	config: any;
	searchOptions: any;
	serverLogs: any;
	pagination: any;
	loading: boolean;
	logsCallError: boolean;

	constructor(private serverMonitoringService: ServerMonitoringService, private errorHandlerService: ErrorHandlerService,
		private router: Router){

		this.loading = true;
		this.config = {
			'errorCode': {
				'0xx': 'code-0xx',
				'1xx': 'code-1xx',
				'2xx': 'code-2xx',
				'3xx': 'code-3xx',
				'4xx': 'code-4xx',
				'5xx': 'code-5xx',
			}
		};
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0,
			totalSize: 0,
		};

	}
	ngOnInit(){
	}
	ngOnChanges(change: SimpleChanges) {
		if(change['updatedSearchOptions'] && change['updatedSearchOptions']['currentValue']) {
			
			this.searchOptions = this.updatedSearchOptions;
			this.searchOptions['from'] = 0,
			this.searchOptions['size'] = this.pagination.pageSize;
			this.pageChange(1);
		}
		else if(change['tabselected'] && change['tabselected']['currentValue'] === 'log'){
			
			this.getServerLogs(true);
		} else {
		}
	}

	getErrorCodeStatusClass(errorCodeStatus) {
		if(errorCodeStatus) {
			return this.config.errorCode[errorCodeStatus.toString().toLowerCase().substr(0,1) + 'xx'];
		}
		return '';
	}

	populateSearchOptions() {
		
		let startTime = this.graphDataZoom['start_time'];
		let endTime = this.graphDataZoom['end_time']
		this.searchOptions = {
			business: this.graphDataZoom['business'],
			from: (this.pagination.page - 1) * this.pagination.pageSize,
			size: this.pagination.pageSize,
			start_time: startTime,
			end_time: endTime
		};
	}

	getServerLogs(init?) {
		if(init && this.serverLogs) return;
		this.loading = true;
		this.logsCallError = false;
		if(init) {
			this.populateSearchOptions();
		}
		this.serverMonitoringService.getLogs(this.searchOptions).subscribe(data => {
			
			this.logsSearchOptions.emit(this.searchOptions);

			this.loading = false;
			if(data && data.message && data.message != '') {
				this.logsCallError = true;	
			} else {
				
				var reslogs = [];
				var extraparams = {};
				for(let i=0; i<data.items.length*2;i+=2)
				{
					if(i === 0)
					{
						reslogs[i] = Object.create(data.items[i]);
						reslogs[i]['dynamicRow']=false;
						reslogs[i]['expandDetails']=false;
						reslogs[i+1] = Object.create(data.items[i]);
						reslogs[i+1]['dynamicRow']=true;
						reslogs[i+1]['expandDetails']=false;
					}
					else{
						reslogs[i] = Object.create(data.items[i/2]);
						reslogs[i]['dynamicRow']=false;
						reslogs[i]['expandDetails']=false;
						reslogs[i+1] = Object.create(data.items[i/2]);
						reslogs[i+1]['dynamicRow']=true;
						reslogs[i+1]['expandDetails']=false;
					}
					
					
				}
				var obj = Object.create(data);
				obj.items = reslogs;
				this.serverLogs = obj;
				// this.serverLogs = reslogs;
				if(init) {
					this.serverLogsOut.emit(data);
				}
				this.updatePaginationParameters();
			}
		}, error => {
			this.serverLogs = null;
			this.loading = false;
			this.logsCallError = true;
		});

	}

	updatePaginationParameters() {
		this.pagination.collectionSize = this.serverLogs['total_count'];
		this.pagination.totalSize = this.serverLogs['max_count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	pageChange(currPage){
		console.log(currPage);
		this.pagination.page = currPage;
		this.searchOptions['from'] = (this.pagination.page - 1) * this.pagination.pageSize;
		this.getServerLogs();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.logsCallError) {
			return false;	
		}
		if(this.showNoLogsMsg()) {
			return false;
		}
		return true;
	}

	showNoLogsMsg() {
		return !this.loading && (this.serverLogs && this.serverLogs['items'] && (this.serverLogs['items'].length == 0));
	}

	triggerlog(index, log){
		if(this.serverLogs.items[index].expandDetails)
		{
			this.serverLogs.items[index].expandDetails = false;
		}
		else{
			this.serverLogs.items[index].expandDetails = true;
		}
	}

}
