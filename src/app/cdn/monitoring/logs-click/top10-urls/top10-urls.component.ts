import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { ServerMonitoringService } from '../../../../_services/monitoring-service/server-monitoring.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';

@Component({
	selector: 'app-top10-urls',
	templateUrl: './top10-urls.component.html',
	providers: [ServerMonitoringService, ErrorHandlerService]
})
export class Top10UrlsComponent implements OnInit, OnChanges {
	@Input() perfFilterOptions: any;
	@Input() tabselected: any;

	tabsList: any;
	loading: any;
	options: any;
	logsCallError: any;
	serverLogs: any;
	params: any;
	showNoUrlsMsg: any;
  
	constructor(private serverMonitoringService: ServerMonitoringService, private errorHandlerService: ErrorHandlerService) {
		this.tabsList = [
			{template : '5XX',active:true},
			{template : '2XX',active:false},
			{template : '4XX',active:false},
			{template : '0XX',active:false},
		];
		this.options = {};
		this.params = {};
		this.showNoUrlsMsg = false;
	}

  ngOnInit() {
  }
	ngOnChanges(change: SimpleChanges) {
		if(change['perfFilterOptions'] && change['perfFilterOptions']['currentValue'] && change['perfFilterOptions']['previousValue'] && this.perfFilterOptions.status_group === '5XX') {
		
			this.tabsList = [
				{template : '5XX',active:true},
				{template : '2XX',active:false},
				{template : '4XX',active:false},
				{template : '0XX',active:false},
			];
			
		this.showNoUrlsMsg = false;
		this.options = {};
		this.getTop10Urls('5XX');
		}
		else if(change['tabselected'] && change['tabselected']['currentValue'] === 'top10'){
		
			this.getTop10Urls('5XX');
		}
		else{
		}	
	}
  public getTop10Urls(tabType: any) {
    if(!this.options[tabType]){
		this.loading = true;
		this.params = this.perfFilterOptions;
		this.params.status_group = tabType;
		this.serverMonitoringService.getTopUrls(this.params).subscribe(data => {
			this.loading = false;
			this.logsCallError = false;
			this.options[tabType] = data;
			if(this.options[tabType].topurls.length === 0)
			{
				this.showNoUrlsMsg = true;
			}
			
		}, error => {

			this.options[tabType] = null;
			this.loading = false;
			this.logsCallError = true;
		});
    }
  }
  

}
