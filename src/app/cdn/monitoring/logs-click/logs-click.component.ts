import { OnInit, Component, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ServerMonitoringService } from '../../../_services/monitoring-service/server-monitoring.service';

@Component({
	selector: 'logs-click',
	styles: [],
	providers: [],
	templateUrl: './logs-click.component.html'
})

export class LogsClickComponent implements OnInit, OnChanges {
	@Input() graphDataZoom: any;
	@Input() businessAccessDetails: any;
	@Input() perfFilterOptions: any;
	@Input() businessFilters: any;
	@Input() formOptions: any;
	@Input() tabtype: any;
	@Input() tabselected: any;
	serverLogs: any;
	searchOptions: any;
	isFilterCollapsed: boolean;
	loading: boolean;

	constructor(private serverMonitoringService: ServerMonitoringService) {
		this.isFilterCollapsed = false;


	}
	ngOnInit() {
	}
	ngOnChanges(change: SimpleChanges) {

	}

	toggleLogsFilter() {
		this.isFilterCollapsed = !this.isFilterCollapsed;
	}

	triggerFilterCollapse(collapse) {
		if (collapse) {
			this.isFilterCollapsed = !this.isFilterCollapsed;
		}
	}

	updateSearchOptions(searchOptions: any) {
		if (this.tabtype === 'top10') {
			let searchOptionsnew = {
				start_time: searchOptions.start_time,
				end_time: searchOptions.end_time,
				business: searchOptions.business,
				status_group: '5XX'
			}
			if (searchOptions.service_type) {
				searchOptionsnew = Object.assign(searchOptionsnew, { service_type: searchOptions.service_type })
			}
			if (searchOptions.cp_code) {
				searchOptionsnew = Object.assign(searchOptionsnew, { cp_code: searchOptions.cp_code })
			}

			this.formOptions = searchOptionsnew;
		}

		this.searchOptions = searchOptions;
		this.isFilterCollapsed = false;

	}

	updateServerLogs(serverLogs: any) {
		this.serverLogs = serverLogs;
	}

	updatedLogsSearchOptions(searchOptions: any) {
		this.searchOptions = searchOptions;
		console.log(searchOptions);
	}

	getLogsCsvData() {
		this.loading = true;
		this.searchOptions['size'] = 10000;
		this.searchOptions['from'] = 0;
		this.serverMonitoringService.getCsvLogs(this.searchOptions).subscribe(data => {
			console.log(data);
			if (data) {
				this.downloadFile(data);
			}
			else {
				this.loading = false;
			}

		})
	}

	downloadFile(data) {
		let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
		let dwldLink = document.createElement("a");
		let url = URL.createObjectURL(blob);
		let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
		if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
			dwldLink.setAttribute("target", "_blank");
		}
		dwldLink.setAttribute("href", url);
		dwldLink.setAttribute("download", "Enterprise.csv");
		dwldLink.style.visibility = "hidden";
		document.body.appendChild(dwldLink);
		dwldLink.click();
		document.body.removeChild(dwldLink);
		this.loading = false;
	}


}