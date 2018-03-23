// import { Component, Input, Output, EventEmitter, TemplateRef, SimpleChanges, OnInit } from '@angular/core';
// import { DatePipe } from '@angular/common';

// import { ServerMonitoringService } from '../../_services/monitoring-service/server-monitoring.service';
// import { ErrorHandlerService } from '../../_services/error-handler.service';
// import { BusinessAccessDetailsService } from '../../_services/business-access-details.service';
// import { LineGraphDataModel, StackLineGraphComponent } from '../server/server-stats/stack-line-graph/stack-line-graph.component';
// import { Router, NavigationEnd } from '@angular/router';
// import { FormGroup, FormControl, Validators } from '@angular/forms';

// @Component({
// 	selector: 'server-monitoring',
// 	styles: [],
// 	providers: [ErrorHandlerService, ServerMonitoringService, BusinessAccessDetailsService],
// 	templateUrl: './monitoring.component.html'
// })

// export class MonitoringComponent implements OnInit {
// 	serverMonitoringData: any;
// 	loading: any;
// 	loadingError: any;
// 	myFromDate: Date;
// 	myToDate: Date = new Date();
// 	myFromDateDisplay: string;
// 	myToDateDisplay: string;
// 	businessAccessDetails: any;
// 	showFromPicker: boolean = false;
// 	showToPicker: boolean = false;
// 	showDate: boolean = true;
// 	showTime: boolean = true;
// 	showGraphs: boolean = false;
// 	viewGraphsErrorMessage: string;
// 	formOptions: any;
// 	@Input() graphParams: any;
// 	@Input() callResize: boolean;
	
// 	constructor(private serverMonitoringService: ServerMonitoringService, 
// 		private errorHandlerService: ErrorHandlerService,
// 		private businessAccessDetailsService: BusinessAccessDetailsService, 
// 		private router: Router) {

// 		this.myFromDate = new Date();
// 		this.myFromDate.setDate(this.myFromDate.getDate() - 10);
// 		this.myFromDate.setHours(0,0,0,0);
// 		this.updateFromDateDisplay();
// 		this.updateToDateDisplay();
// 		this.serverMonitoringData = {
// 			avgRequestTime: [],
// 			manifestAvgRequestTime: [],
// 			platformDistribution: [],
// 			avgBitrate: [],
// 			percentErrors: [],
// 		};
// 		this.loading = {
// 			avgRequestTime: true,
// 			manifestAvgRequestTime: true,
// 			platformDistribution: true,
// 			avgBitrate: true,
// 			percentErrors: true,
// 		};
// 		this.loadingError = {
// 			avgRequestTime: false,
// 			manifestAvgRequestTime: false,
// 			platformDistribution: false,
// 			avgBitrate: false,
// 			percentErrors: false,
// 		};
// 	}

// 	ngOnInit() {
// 		this.getMyBusinesses();
// 	}

// 	ngOnChanges(changes: SimpleChanges) {

// 		// let callResizeValues = changes['callResize'];
		
// 		//    if(callResizeValues && callResizeValues.firstChange){
// 			//     	this.getMonitoringData(); 
// 			//    }
// 		}

// 		formatDate(date: Date) {
// 			return date.toUTCString();
// 		}

// 		onSubmit(formData: FormGroup) {
// 			if (formData.invalid || (this.myFromDate > this.myToDate)) {
// 				this.showGraphs = false;
// 				if (this.myFromDate > this.myToDate) {
// 					this.viewGraphsErrorMessage = '"From Date" cannot be greater than "To Date"';
// 				}
// 				return;
// 			}
// 			this.showGraphs = true;
// 			// let graphsPosition = jQuery('#avgRequestTimeContainer').position();
// 			// document.body.scrollBy(graphsPosition.left, graphsPosition.top);
// 			// document.body.scrollTop = graphsPosition.top;
// 			this.getMonitoringData(formData.value);
// 		}

// 		getMyBusinesses() {
// 			this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
// 				this.businessAccessDetails = data;
// 			}, error => {

// 			})
// 		}

// 		onFromDateChange(val: Date) {
// 			this.myFromDate = val;
// 			this.updateFromDateDisplay();
// 		}

// 		onToDateChange(val: Date) {
// 			this.myToDate = val;
// 			this.updateToDateDisplay();
// 		}

// 		updateFromDateDisplay() {
// 			this.myFromDateDisplay = this.myFromDate.toUTCString().split(' GMT')[0];
// 		}

// 		updateToDateDisplay() {
// 			this.myToDateDisplay = this.myToDate.toUTCString().split(' GMT')[0];
// 		}    

// 		onToggleFromPicker() {
// 			if (this.showFromPicker === false) {
// 				this.showFromPicker = true;
// 			}
// 		}

// 		onToggleToPicker() {
// 			if (this.showToPicker === false) {
// 				this.showToPicker = true;
// 			}
// 		}

// 		getAvgRequestTime() {
// 			this.loadingError['avgRequestTime'] = false;
// 			this.serverMonitoringData['avgRequestTime'] = [];
// 			this.loading['avgRequestTime'] = true;
// 			this.serverMonitoringService.getAvgRequestTime(this.formOptions).subscribe(data => {
// 				if (data) {
// 					if (!data['items']) {
// 						this.loading['avgRequestTime'] = false;
// 						this.loadingError['avgRequestTime'] = true;		
// 						return;
// 					}
// 					let items = data['items']; 
// 					let requestTimeDataArr = [];
// 					for(let i = 0; i < items.length; i++) {
// 						if (!items[i]['ts'] || !items[i]['avg_req_time']) {
// 							continue;
// 						}
// 						let dataArr = [];
// 						dataArr.push(new Date(items[i]['ts']).getTime());
// 						dataArr.push(items[i]['avg_req_time']);
// 						requestTimeDataArr.push(dataArr);
// 					}
// 					this.serverMonitoringData['avgRequestTime'].push({
// 						name: 'Average Request Time',
// 						data: requestTimeDataArr
// 					});
// 				}
// 				this.loading['avgRequestTime'] = false;

// 			}, error => {
// 				this.loading['avgRequestTime'] = false;
// 				this.loadingError['avgRequestTime'] = true;
// 			});
// 		}

// 		getManifestAvgRequestTime() {
// 			this.loadingError['manifestAvgRequestTime'] = false;
// 			this.serverMonitoringData['manifestAvgRequestTime'] = [];
// 			this.loading['manifestAvgRequestTime'] = true;
// 			this.serverMonitoringService.getAvgRequestTime(this.formOptions).subscribe(data => {
// 				if (data) {
// 					if (!data['items']) {
// 						this.loading['manifestAvgRequestTime'] = false;
// 						this.loadingError['manifestAvgRequestTime'] = true;		
// 						return;
// 					}
// 					let items = data['items']; 
// 					let manifestRequestTimeDataArr = [];
// 					for(let i = 0; i < items.length; i++) {
// 						if (!items[i]['ts'] || !items[i]['manifest_avg_req_time']) {
// 							continue;
// 						}
// 						let dataArr = [];
// 						dataArr.push(new Date(items[i]['ts']).getTime());
// 						dataArr.push(items[i]['manifest_avg_req_time']);
// 						manifestRequestTimeDataArr.push(dataArr);
// 					}
// 					this.serverMonitoringData['manifestAvgRequestTime'].push({
// 						name: 'Manifest Average Request Time',
// 						data: manifestRequestTimeDataArr
// 					});
// 				}
// 				this.loading['manifestAvgRequestTime'] = false;

// 			}, error => {
// 				this.loading['manifestAvgRequestTime'] = false;
// 				this.loadingError['manifestAvgRequestTime'] = true;
// 			});
// 		}

// 		getAvgBitrate() {
// 			this.loadingError['avgBitrate'] = false;
// 			this.serverMonitoringData['avgBitrate'] = [];
// 			this.loading['avgBitrate'] = true;
// 			this.serverMonitoringService.getAvgBitrate(this.formOptions).subscribe(data => {
// 				if (data) {
// 					if (!data['items']) {
// 						this.loading['avgBitrate'] = false;
// 						this.loadingError['avgBitrate'] = true;
// 						return;
// 					}
// 					let items = data['items']; 
// 					let requestTimeDataArr = [];
// 					for(let i = 0; i < items.length; i++) {
// 						if (!items[i]['ts'] || !items[i]['avg_bitrate']) {
// 							continue;
// 						}
// 						let dataArr = [];
// 						dataArr.push(new Date(items[i]['ts']).getTime());
// 						dataArr.push(items[i]['avg_bitrate']);
// 						requestTimeDataArr.push(dataArr);
// 					}
// 					this.serverMonitoringData['avgBitrate'].push({
// 						name: 'Average Bitrate',
// 						data: requestTimeDataArr
// 					});
// 				}
// 				this.loading['avgBitrate'] = false;
// 			}, error => {
// 				this.loading['avgBitrate'] = false;
// 				this.loadingError['avgBitrate'] = true;
// 			});
// 		}

// 		getPlatformDistribution() {
// 			this.loadingError['platformDistribution'] = false;
// 			this.serverMonitoringData['platformDistribution'] = [];
// 			this.loading['platformDistribution'] = true;
// 			this.serverMonitoringService.getPlatformDistribution(this.formOptions).subscribe(data => {
// 				if (data) {
// 					if (!data['items']) {
// 						this.loading['platformDistribution'] = false;
// 						this.loadingError['platformDistribution'] = true;
// 						return;
// 					}
// 					let items = data['items']; 
// 					let platformDistributionMap = {};
// 					for(let i = 0; i < items.length; i++) {
// 						if (!items[i]['ts'] || !items[i]['distribution']) {
// 							continue;
// 						}
						
// 						for (let prop in items[i]['distribution']) {
// 							let dataArr = [];
// 							dataArr.push(new Date(items[i]['ts']).getTime());
// 							dataArr.push(items[i]['distribution'][prop]);
// 							if (!platformDistributionMap[prop]) {
// 								platformDistributionMap[prop] = [];
// 							}
// 							platformDistributionMap[prop].push(dataArr);
							
// 						}					
// 					}
// 					for (let key in platformDistributionMap) {
// 						this.serverMonitoringData['platformDistribution'].push({
// 							name: key,
// 							data: platformDistributionMap[key]
// 						});
// 					}
// 				}
// 				this.loading['platformDistribution'] = false;
// 			}, error => {
// 				this.loading['platformDistribution'] = false;
// 				this.loadingError['platformDistribution'] = true;
// 			});
// 		}

// 		getPercentErrors() {
// 			this.loadingError['percentErrors'] = false;
// 			this.serverMonitoringData['percentErrors'] = [];
// 			this.loading['percentErrors'] = true;
// 			this.serverMonitoringService.getPercentErrors(this.formOptions).subscribe(data => {
// 				if (data) {
// 					if (!data['items']) {
// 						this.loading['percentErrors'] = false;
// 						this.loadingError['percentErrors'] = true;
// 						return;
// 					}
// 					let items = data['items']; 
// 					let errorDistributionMap = {};
// 					for(let i = 0; i < items.length; i++) {
// 						if (!items[i]['ts'] || !items[i]['distribution']) {
// 							continue;
// 						}
						
// 						for (let prop in items[i]['distribution']) {
// 							let dataArr = [];
// 							dataArr.push(new Date(items[i]['ts']).getTime());
// 							dataArr.push(items[i]['distribution'][prop]);
// 							if (!errorDistributionMap[prop]) {
// 								errorDistributionMap[prop] = [];
// 							}
// 							errorDistributionMap[prop].push(dataArr);
							
// 						}					
// 					}
// 					for (let key in errorDistributionMap) {
// 						this.serverMonitoringData['percentErrors'].push({
// 							name: key,
// 							data: errorDistributionMap[key]
// 						});
// 					}
// 				}
// 				this.loading['percentErrors'] = false;
// 			}, error => {
// 				this.loading['percentErrors'] = false;
// 				this.loadingError['percentErrors'] = true;
// 			});
// 		}

// 		getMonitoringData(formData: any) {
// 			// let fromDate = Date.UTC(this.myFromDate.getUTCFullYear(), 
// 			// 						this.myFromDate.getUTCMonth(),
// 			// 						this.myFromDate.getUTCDay(), 
// 			// 						this.myFromDate.getUTCHours(), 
// 			// 						this.myFromDate.getUTCMinutes(), 
// 			// 						this.myFromDate.getUTCSeconds(), 
// 			// 						this.myFromDate.getUTCMilliseconds());

// 			// let toDate = Date.UTC(this.myToDate.getUTCFullYear(), 
// 			// 						this.myToDate.getUTCMonth(),
// 			// 						this.myToDate.getUTCDay(), 
// 			// 						this.myToDate.getUTCHours(), 
// 			// 						this.myToDate.getUTCMinutes(), 
// 			// 						this.myToDate.getUTCSeconds(), 
// 			// 						this.myToDate.getUTCMilliseconds());		

// 			let fromDate = this.myFromDate.getTime();
// 			let toDate = this.myToDate.getTime();
			
// 			this.formOptions = {
// 				start_time: Math.round(fromDate / 1000),
// 				end_time: Math.round(toDate / 1000),
// 				business: formData['select-business']
// 			};
// 			this.getAvgRequestTime();
// 			this.getManifestAvgRequestTime();
// 			this.getAvgBitrate();
// 			this.getPlatformDistribution();
// 			this.getPercentErrors();	
			
// 		}


// 	}