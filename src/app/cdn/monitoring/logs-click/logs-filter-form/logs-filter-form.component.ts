import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ServerMonitoringService } from '../../../../_services/monitoring-service/server-monitoring.service';

@Component({
	selector: 'logs-filter-form',
	styles: [],
	providers: [ServerMonitoringService],
	templateUrl: './logs-filter-form.component.html'
})

export class LogsFilterFormComponent {
	@Input() businessAccessDetails: any;
	@Input() businessFilters: any;
	@Input() perfFilterOptions: any;
	@Input() graphDataZoom: any;
	@Input() serverLogs: any;
	@Input() tabtype: any;
	@Input() tabselected: any;
	@Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
	@Output() triggerFilterCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();
	formData: any;
	filters: any;
	cpCodes: any;
	statusCodeDisabled: boolean;
	cpCodeDisabled: boolean;
	viewLogsErrorMessage: string;
	serviceTypeDisabled: any;
	formFilters: any;
	businessFiltersOut: any;
	count: any;

	constructor(private serverMonitoringService: ServerMonitoringService) {
		// this.businessAccessDetails = [];
		this.formData = {
			filterKeys: []
		};
		this.filters = {
			statusCodeGroups:[],
			statusCodes:{},
			genericKeys:[],
			genericFilterRows: [true]
		};
		
		
		
		this.formData.cpCode = '';
		this.formData.serviceType = '';
		this.statusCodeDisabled = true;
		this.cpCodeDisabled = true;
		this.count = 0;
		this.formData.myFromDate = new Date();
		this.formData.myFromDate.setDate(this.formData.myFromDate.getDate() - 1);
		this.formData.myToDate = new Date();	


	}

	ngOnInit() {
		this.initForm();
	}
	ngOnChanges(change: SimpleChanges){
		if(change['perfFilterOptions'] && change['perfFilterOptions']['currentValue'] && !change['tabselected'] && !this.tabselected){
			 this.formData.business = this.perfFilterOptions.business;
			 this.formData.myFromDate = new Date(this.perfFilterOptions.start_time*1000);
			 this.formData.myToDate = new Date(this.perfFilterOptions.end_time*1000);
		}
		else{
		}
	}
	getCPCodes(options) {
		this.serverMonitoringService.getCPCodes(options).subscribe(data => {
		  if (data) {
			if (!data['items']) {
			  return;
			}
			let items = data['items']; 
			this.formFilters = {};
			this.formFilters['serviceTypes'] = [];
			for(let i = 0; i < items.length; i++) {
			  let item = items[i];
			  if(!this.formFilters[item['service_type']]) {
				this.formFilters[item['service_type']]  = [];
				this.formFilters['serviceTypes'].push([item['service_type']]);  
			  }
			  this.formFilters[item['service_type']].push({
				cp_code: item['cp_code'],
				cp_code_name: item['cp_code_name']
			  });  
			}
			// this.businessFiltersOut.emit(this.formFilters);
			this.businessFiltersOut = this.formFilters;
		  }
		}, error => {
		//   this.loading['percentErrors'] = false;
		//   this.loadingError['percentErrors'] = true;
		});  
	  }
	
	onBusinessSelected() {
		this.serviceTypeDisabled = false;
		this.formData.serviceType = '';
		this.formData.cpCode = '';
		this.cpCodeDisabled = true;
		this.getCPCodes({
		  business: this.formData.business
		});
	  }

	addGenericFilterKeyRow() {
		this.filters.genericFilterRows.push(true);
		this.formData['filterKeys'][this.filters.genericFilterRows.length - 1] = '';
	}

	deleteGenericFilterKeyRow(index) {
		this.filters.genericFilterRows.splice(index, 1);
		this.formData['filterKeys'].splice(index,1);
	}

	trackByIndex(index: number, value: any) {
		return index;
	}

	initForm() {
		this.getAllResponseStatuses();

		if(this.perfFilterOptions) {
			if(this.businessAccessDetails && this.businessAccessDetails.length > 0) {
				this.formData['business'] = this.perfFilterOptions['business'];
			}
		}
		let startTime = this.graphDataZoom['start_time_init'] + 
		Math.ceil((this.graphDataZoom['end_time_init'] - this.graphDataZoom['start_time_init']) 
			* (this.graphDataZoom['start'] / 100));
		let endTime = this.graphDataZoom['start_time_init'] + 
		Math.ceil((this.graphDataZoom['end_time_init'] - this.graphDataZoom['start_time_init']) 
			* (this.graphDataZoom['end'] / 100));
		// this.formData.myFromDate = new Date(startTime * 1000);
		// this.formData.myToDate = new Date(endTime * 1000);
		this.populateGenericFilterKeys();
	}

	populateGenericFilterKeys() {

		this.serverMonitoringService.getLogsFilterKeys().subscribe(data => {
			if(data && data['filters']) {
				for(let prop in data['filters']) {
					if(data['filters'][prop] === 'business' 
						|| data['filters'][prop] === 'service_type' 
						|| data['filters'][prop] === 'cp_code' 
						|| data['filters'][prop] === 'status' 
						|| data['filters'][prop] === 'status_group') {
						continue;
					}
					this.filters['genericKeys'].push({name: prop,key: data['filters'][prop]});
				}
			}
		}, error => {

		})

		this.formData.filterKeys[0] = '';
	}	



	getAllResponseStatuses() {
		if(this.filters['statusCodeGroups'] && this.filters['statusCodeGroups'].length > 0) return;
		this.serverMonitoringService.getResponseStatuses().subscribe(data => {
			if(data && data['filters'] && data['filters'].length > 0) {
				for(let i = 0; i < data['filters'].length; i++) {
					if(data['filters'][i]['filter_key'] == 'status_group') {
						this.filters['statusCodeGroups'] = data['filters'][i]['filter_values'];	
						if(this.filters['statusCodeGroups'].length > 0) {
							this.formData.statusCodeGroup = '';		
						}
					} else if(data['filters'][i]['filter_key'] == 'status') {
						this.filters['statusCodes'] = data['filters'][i]['filter_values'];
						this.formData.statusCode = '';				
					} else if(data['filters'][i]['filter_key'] == 'method') {
						this.filters['httpMethods'] = data['filters'][i]['filter_values'];
						this.formData.httpMethod = '';				
					}
				}

			} else {

			}
		}, error => {
			console.log("error");
		})
	}

	onSubmit(tabtype1: any) {

		let filters = {};
		if (this.formData['statusCodeGroup'] != '' && this.formData['statusCode'] == '') {
			filters['status_group'] = this.formData['statusCodeGroup'];
		}
		if (this.formData['statusCode'] != '') {
			filters['status'] = this.formData['statusCode'];
		}
		if (this.formData['httpMethod'] != '') {
			filters['method'] = this.formData['httpMethod'].toLowerCase();
		}
		for(let i = 0; i < this.formData['filterKeys'].length; i++) {
			if(!this.formData['filterKeys'][i] || this.formData['filterKeys'][i] == ''){
				continue;
			}
			if(this.formData[this.formData['filterKeys'][i]] && this.formData[this.formData['filterKeys'][i]] != '') {
				filters[this.formData['filterKeys'][i]] = this.formData[this.formData['filterKeys'][i]];
			}
		}
		let options = {
			business: this.formData['business'],
			start_time: Math.ceil(Date.parse(this.formData.myFromDate.toString()) / 1000),
			end_time: Math.ceil(Date.parse(this.formData.myToDate.toString()) / 1000),
		};

		if(this.tabtype === 'top10')
		{
			
			
			if(this.formData.serviceType){
				options = Object.assign(options,{service_type: this.formData.serviceType})
			}
			if(this.formData.cpCode){
				options = Object.assign(options,{cp_code: this.formData.cpCode})
			}
			
		}
		
		let filterCnt = 0;
		for(let prop in filters) {
			filterCnt++;
		}
		if(filterCnt > 0) {
			options['filter'] = JSON.stringify(filters);
		}
		this.searchOptions.emit(options);
	}

	triggerCollapse() {
		this.triggerFilterCollapse.emit(true);
	}

	onServiceTypeSelected() {
		this.formData.cpCode = '';
		this.cpCodeDisabled = false;		
		// this.cpCodes = this.businessFilters[this.formData.serviceType];
		this.cpCodes = this.formFilters[this.formData.serviceType];
	}
	

	onStatusCodeGroupSelected() {
		// if(this.filters['statusCodes'] && this.formData.statusCodeGroup && 
		// 	this.filters['statusCodes'][this.formData.statusCodeGroup]) {

		// }
		if(this.formData.statusCodeGroup != '') {
			this.statusCodeDisabled = false;
		}
		this.formData.statusCode = '';
	}
}