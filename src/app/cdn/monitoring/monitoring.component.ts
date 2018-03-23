import { Component, Input, Output, EventEmitter, TemplateRef, SimpleChanges, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as jQuery from 'jquery';
import { ServerMonitoringService } from '../../_services/monitoring-service/server-monitoring.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { StackLineGraphComponent } from '../../shared/stack-line-graph/stack-line-graph.component';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'cdn-monitoring',
	styles: [],
	providers: [ErrorHandlerService, ServerMonitoringService],
	templateUrl: './monitoring-check.component.html'
})

export class MMonitoringComponent implements OnInit {
	serverMonitoringData: any;
	businessAccessDetails: any;
	businessFilters: any;
	isFilterCollapsed: boolean;
	staticTab: any;
	dynamicTabs: any[];
	loading: any;
	loadingError: any;
	showGraphs: boolean = true;
	viewGraphsErrorMessage: string;
	formOptions: any;
	graphDataZoom: any;
	callLogTabResize: boolean;
	isMouseDown: boolean;
	tabselected: any;
	@Input() graphParams: any;
	@Input() callResize: boolean;
	
	constructor(private cdRef:ChangeDetectorRef,
		private serverMonitoringService: ServerMonitoringService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
		this.staticTab = {
			active: true
		};
		this.dynamicTabs = [];
		this.isFilterCollapsed = false;
		this.serverMonitoringData = {
			totalRequests: [],
			avgRequestTime: [],
			manifestAvgRequestTime: [],
			osDistribution: [],
			deviceDistribution: [],
			originBandwidth: [],
			edgeBandwidth: [],
			percentErrors: [],
			totalBytes: [],
			bandwidthOffloadTime: [],
			compedgeBandwidth: []
		};
		this.loading = {
			business: true,
			totalRequests: true,
			avgRequestTime: true,
			manifestAvgRequestTime: true,
			osDistribution: true,
			deviceDistribution: true,
			originBandwidth: true,
			edgeBandwidth: true,
			percentErrors: true,
			totalBytes: true,
			bandwidthOffloadTime: true,
			compedgeBandwidth: true
		};
		this.loadingError = {
			business: false,
			totalRequests: false,
			avgRequestTime: false,
			manifestAvgRequestTime: false,
			osDistribution: false,
			deviceDistribution: false,
			originBandwidth: false,
			edgeBandwidth: false,
			percentErrors: false,
			totalBytes: false,
			bandwidthOffloadTime: false,
			compedgeBandwidth: false
		};
		this.graphDataZoom = {
			top10urls: null,
			totalRequests: null,
			avgRequestTime: null,
			manifestAvgRequestTime: null,
			osDistribution: null,
			deviceDistribution: null,
			originBandwidth: null,
			edgeBandwidth: null,
			percentErrors: null,
			totalBytes: null,
			bandwidthOffloadTime: null,
			compedgeBandwidth: null
		};
	}

	ngOnInit() {
		this.doCreateTab();

	}
	onselect(tabT: any){
		this.tabselected = tabT; 
		
	}
	doCreateTab(){

		let tabparams1 = {active:false,
			disabled:false,
			graphDataZoom:{start: 0, end: 100, business: "Ad Tech", start_time_init: 1520319912, end_time_init: 1520406312},
			removable:false,
			tabType:"5XX",
			title:"Top 10 Urls",
			type:"top10"}
		let tabparams2 = {active:false,
			disabled:false,
			graphDataZoom:{start: 0, end: 100, business: "Ad Tech", start_time_init: 1520319912, end_time_init: 1520406312},
			removable:false,
			title:"Raw Logs",
			type:"log"}
		this.addDynamicTab(tabparams1);
		this.addDynamicTab(tabparams2);
	}
	ngAfterViewChecked()
	{
		this.cdRef.detectChanges();
	}

	ngOnChanges(changes: SimpleChanges) {
	}

	formatDate(date: Date) {
		return date.toUTCString();
	}

	updateBusinessAccessDetails(businessAccessDetails: any) {
		this.businessAccessDetails = businessAccessDetails;
	}

	updateBusinessFilters(businessFilters: any) {
		this.businessFilters = businessFilters;
	}

	updateSearchOptions(searchOptions: any) {
		this.formOptions = searchOptions;
		this.getMonitoringData();
		
		this.isFilterCollapsed = false;
		
	}

	onSubmit() {
	}


	checkNullString(str) {
		if(str && str.length > 0) {
			return str;
		}
		return '';
	}

	getISTTime(datetime) {
		if(this.checkNullString(datetime) != '') {
			return new Date(datetime).toString().split(' GMT+0530')[0];
		}
		return '';
	}

	triggerFilterCollapse(collapse) {
		if(collapse) {
			this.isFilterCollapsed = !this.isFilterCollapsed;
		}
	}


	getTotalRequests() {
		this.loadingError['totalRequests'] = false;
		this.serverMonitoringData['totalRequests'] = [];
		this.loading['totalRequests'] = true;
		this.serverMonitoringService.getTotalRequests(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['totalRequests'] = false;
					this.loadingError['totalRequests'] = true;		
					return;
				}
				let items = data['items']; 
				let requestTimeDataArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['total_req'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['total_req']);
					requestTimeDataArr.push(dataArr);
				}
				this.serverMonitoringData['totalRequests'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Total Requests',
					data: requestTimeDataArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['totalRequests'] = false;

		}, error => {
			this.loading['totalRequests'] = false;
			this.loadingError['totalRequests'] = true;
		});
	}

	getAvgRequestTime() {
		this.loadingError['avgRequestTime'] = false;
		this.serverMonitoringData['avgRequestTime'] = [];
		this.loading['avgRequestTime'] = true;
		this.serverMonitoringService.getAvgRequestTime(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['avgRequestTime'] = false;
					this.loadingError['avgRequestTime'] = true;		
					return;
				}
				let items = data['items']; 
				let requestTimeDataArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['avg_req_time'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['avg_req_time']);
					requestTimeDataArr.push(dataArr);
				}
				this.serverMonitoringData['avgRequestTime'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Average Request Time',
					data: requestTimeDataArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['avgRequestTime'] = false;

		}, error => {
			this.loading['avgRequestTime'] = false;
			this.loadingError['avgRequestTime'] = true;
		});
	}

	getManifestAvgRequestTime() {
		this.loadingError['manifestAvgRequestTime'] = false;
		this.serverMonitoringData['manifestAvgRequestTime'] = [];
		this.loading['manifestAvgRequestTime'] = true;
		this.serverMonitoringService.getManifestAvgRequestTime(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['manifestAvgRequestTime'] = false;
					this.loadingError['manifestAvgRequestTime'] = true;		
					return;
				}
				let items = data['items']; 
				let manifestRequestTimeDataArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['manifest_avg_req_time'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['manifest_avg_req_time']);
					manifestRequestTimeDataArr.push(dataArr);
				}
				this.serverMonitoringData['manifestAvgRequestTime'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Manifest Average Request Time',
					data: manifestRequestTimeDataArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['manifestAvgRequestTime'] = false;

		}, error => {
			this.loading['manifestAvgRequestTime'] = false;
			this.loadingError['manifestAvgRequestTime'] = true;
		});
	}

	getBandwidthOffloadTime() {
		this.loadingError['bandwidthOffloadTime'] = false;
		this.serverMonitoringData['bandwidthOffloadTime'] = [];
		this.loading['bandwidthOffloadTime'] = true;
		this.serverMonitoringService.getBandwidthOffloadTime(this.formOptions).subscribe(data => {
		
			if (data) {
				if (!data['items']) {
					this.loading['bandwidthOffloadTime'] = false;
					this.loadingError['bandwidthOffloadTime'] = true;		
					return;
				}
				let items = data['items']; 
				let bandwidthOffloadTimeDataArr = [];
				for(let i = 0; i < items.length; i++) {

					if (!items[i]['ts'] || items[i]['bandwidth_offload'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['bandwidth_offload']);
					bandwidthOffloadTimeDataArr.push(dataArr);
				}
				this.serverMonitoringData['bandwidthOffloadTime'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Bandwidth Offload',
					data: bandwidthOffloadTimeDataArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['bandwidthOffloadTime'] = false;

		}, error => {
			this.loading['bandwidthOffloadTime'] = false;
			this.loadingError['bandwidthOffloadTime'] = true;
		});
	}

	getCompedgeBandwidth() {
			this.loadingError['compedgeBandwidth'] = false;
			this.serverMonitoringData['compedgeBandwidth'] = [];
			this.loading['compedgeBandwidth'] = true;

			this.loadingError['compedgeBandwidth'] = false;
			this.serverMonitoringData['compedgeBandwidth'] = [];
			this.loading['compedgeBandwidth'] = true;
			// this.formOptions.business = 'gaana';
			// this.formOptions.start_time = 1520812800;
			// this.formOptions.end_time = 1520899200;
			// this.formOptions.cp_code = 264069;
			this.serverMonitoringService.getCompedgeBandwidth(this.formOptions).subscribe(data => {
				let items = data['keystone_items']; 
				let itemstwo = data['akamai_items']; 
				let compedgeBandwidthKeystoneDataArr = [];
				let compedgeBandwidthAkamaiDataArr = [];
				if(items.length!==0)
				{
					for(let i = 0; i < items.length; i++) {

						if (!items[i]['ts'] || items[i]['edge_bandwidth'] == null) {
							continue;
						}
						let dataArr = [];
						dataArr.push(new Date(items[i]['ts']).getTime());
						dataArr.push(items[i]['edge_bandwidth']);
						compedgeBandwidthKeystoneDataArr.push(dataArr);
					}
					this.serverMonitoringData['compedgeBandwidth'].push({
						name: 'Keystone',
						data: compedgeBandwidthKeystoneDataArr,
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
				}
				
				if(itemstwo.length!==0)
				{
					for(let i = 0; i < itemstwo.length; i++) {

						if (!itemstwo[i]['ts'] || itemstwo[i]['edge_bandwidth'] == null) {
							continue;
						}
						let dataArr = [];
						dataArr.push(new Date(itemstwo[i]['ts']).getTime());
						dataArr.push(itemstwo[i]['edge_bandwidth']);
						compedgeBandwidthAkamaiDataArr.push(dataArr);
					}
				
				this.serverMonitoringData['compedgeBandwidth'].push({
								name: 'Akamai',
								data: compedgeBandwidthAkamaiDataArr,
								xAxis: data['x-axis'],
								yAxis: data['y-axis']
							});
				}
			
			this.loading['compedgeBandwidth'] = false;
			this.loading['compedgeBandwidth'] = false;
		}, error => {
			this.loading['compedgeBandwidth'] = false;
			this.loadingError['compedgeBandwidth'] = true;
			this.loading['compedgeBandwidth'] = false;
			this.loadingError['compedgeBandwidth'] = true;
		});
	}

	getOriginBandwidth() {
		this.loadingError['originBandwidth'] = false;
		this.serverMonitoringData['originBandwidth'] = [];
		this.loading['originBandwidth'] = true;
		this.serverMonitoringService.getOriginBandwidth(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['originBandwidth'] = false;
					this.loadingError['originBandwidth'] = true;
					return;
				}
				let items = data['items']; 
				let originBandwidthArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['origin_bandwidth'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['origin_bandwidth']);
					originBandwidthArr.push(dataArr);
				}
				this.serverMonitoringData['originBandwidth'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Origin Bandwidth',
					data: originBandwidthArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['originBandwidth'] = false;
		}, error => {
			this.loading['originBandwidth'] = false;
			this.loadingError['originBandwidth'] = true;
		});
	}

	getEdgeBandwidth() {
		this.loadingError['edgeBandwidth'] = false;
		this.serverMonitoringData['edgeBandwidth'] = [];
		this.loading['edgeBandwidth'] = true;
		this.serverMonitoringService.getEdgeBandwidth(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['edgeBandwidth'] = false;
					this.loadingError['edgeBandwidth'] = true;
					return;
				}
				let items = data['items']; 
				let edgeBandwidthArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['edge_bandwidth'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['edge_bandwidth']);
					edgeBandwidthArr.push(dataArr);
				}
				this.serverMonitoringData['edgeBandwidth'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Edge Bandwidth',
					data: edgeBandwidthArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['edgeBandwidth'] = false;
		}, error => {
			this.loading['edgeBandwidth'] = false;
			this.loadingError['edgeBandwidth'] = true;
		});
	}

	getTotalBytes() {
		this.loadingError['totalBytes'] = false;
		this.serverMonitoringData['totalBytes'] = [];
		this.loading['totalBytes'] = true;
		this.serverMonitoringService.getTotalBytes(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['totalBytes'] = false;
					this.loadingError['totalBytes'] = true;
					return;
				}
				let items = data['items']; 
				let totalBytesArr = [];
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['total_bytes'] == null) {
						continue;
					}
					let dataArr = [];
					dataArr.push(new Date(items[i]['ts']).getTime());
					dataArr.push(items[i]['total_bytes']);
					totalBytesArr.push(dataArr);
				}
				this.serverMonitoringData['totalBytes'].push({
					totalVolume: data['total_volume'],
					leastTS: this.getISTTime(data['least_ts']),
					leastPS: data['least_ps'],
					peakTS: this.getISTTime(data['peak_ts']),
					peakPS: data['peak_ps'],
					name: 'Total Bytes',
					data: totalBytesArr,
					xAxis: data['x-axis'],
					yAxis: data['y-axis']
				});
			}
			this.loading['totalBytes'] = false;
		}, error => {
			this.loading['totalBytes'] = false;
			this.loadingError['totalBytes'] = true;
		});
	}

	getPlatformDistribution() {
		this.loadingError['osDistribution'] = false;
		this.serverMonitoringData['osDistribution'] = [];
		this.loading['osDistribution'] = true;

		this.loadingError['deviceDistribution'] = false;
		this.serverMonitoringData['deviceDistribution'] = [];
		this.loading['deviceDistribution'] = true;
		this.serverMonitoringService.getPlatformDistribution(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['os_items']) {
					this.loading['osDistribution'] = false;
					this.loadingError['osDistribution'] = true;
					return;
				}

				let oses = data['os_items'];
				let osDistributionMap = {};
				for(let i = 0; i < oses.length; i++) {
					if (!oses[i]['ts'] || oses[i]['distribution'] == null) {
						continue;
					}

					for (let prop in oses[i]['distribution']) {
						let dataArr = [];
						dataArr.push(new Date(oses[i]['ts']).getTime());
						dataArr.push(oses[i]['distribution'][prop]);
						if (!osDistributionMap[prop]) {
							osDistributionMap[prop] = [];
						}
						osDistributionMap[prop].push(dataArr);

					}					
				}
				for (let key in osDistributionMap) {
					this.serverMonitoringData['osDistribution'].push({
						name: key,
						data: osDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
				}


				if (!data['device_items']) {
					this.loading['deviceDistribution'] = false;
					this.loadingError['deviceDistribution'] = true;
					return;
				}

				let devices = data['device_items'];
				let deviceDistributionMap = {};
				for(let i = 0; i < devices.length; i++) {
					if (!devices[i]['ts'] || devices[i]['distribution'] == null) {
						continue;
					}

					for (let prop in devices[i]['distribution']) {
						let dataArr = [];
						dataArr.push(new Date(devices[i]['ts']).getTime());
						dataArr.push(devices[i]['distribution'][prop]);
						if (!deviceDistributionMap[prop]) {
							deviceDistributionMap[prop] = [];
						}
						deviceDistributionMap[prop].push(dataArr);

					}					
				}
				for (let key in deviceDistributionMap) {
					this.serverMonitoringData['deviceDistribution'].push({
						name: key,
						data: deviceDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
				}

			}
			this.loading['osDistribution'] = false;
			this.loading['deviceDistribution'] = false;
		}, error => {
			this.loading['osDistribution'] = false;
			this.loadingError['osDistribution'] = true;
			this.loading['deviceDistribution'] = false;
			this.loadingError['deviceDistribution'] = true;
		});
	}

	getPercentErrors() {
		this.loadingError['percentErrors'] = false;
		this.serverMonitoringData['percentErrors'] = [];
		this.loading['percentErrors'] = true;
		this.serverMonitoringService.getPercentErrors(this.formOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading['percentErrors'] = false;
					this.loadingError['percentErrors'] = true;
					return;
				}
				let items = data['items']; 
				let errorDistributionMap = {};
				for(let i = 0; i < items.length; i++) {
					if (!items[i]['ts'] || items[i]['distribution'] == null) {
						continue;
					}

					for (let prop in items[i]['distribution']) {
						let dataArr = [];
						dataArr.push(new Date(items[i]['ts']).getTime());
						dataArr.push(items[i]['distribution'][prop]);
						if (!errorDistributionMap[prop]) {
							errorDistributionMap[prop] = [];
						}
						errorDistributionMap[prop].push(dataArr);

					}					
				}
				for (let key in errorDistributionMap) {
					this.serverMonitoringData['percentErrors'].push({
						name: key,
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
				}
			}
			this.loading['percentErrors'] = false;
		}, error => {
			this.loading['percentErrors'] = false;
			this.loadingError['percentErrors'] = true;
		});
	}

	getMonitoringData() {

		this.getTotalRequests();
		this.getAvgRequestTime();
		this.getManifestAvgRequestTime();
		this.getOriginBandwidth();
		this.getEdgeBandwidth();
		this.getPlatformDistribution();
		this.getPercentErrors();	
		this.getTotalBytes();
		this.getBandwidthOffloadTime();
		this.getCompedgeBandwidth();
	}

	
	checkShowGraphs(showGraphs: any) {
		if(showGraphs) {
			if (!showGraphs['loading']) {
				this.loading['business'] = false;
				if (showGraphs['loadingError']) {
					this.loadingError['business'] = true;
					this.showGraphs = false;
					return;
				}
				if (showGraphs['loadingSuccess']) {
					this.loadingError['business'] = false;
					this.showGraphs = true;
				}
			}

		}
	}

	handleGraphDataZoom(event, type) {
		let self = this;
		setTimeout(function() {
			if(!self.isMouseDown) {
				self.isMouseDown = true;
				event['business'] = self.formOptions['business'];
				event['start_time_init'] = self.formOptions['start_time'];
				event['end_time_init'] = self.formOptions['end_time'];
				self.graphDataZoom[type] = event;		
			}
		}, 500);
	}

	emulateGraphDataZoom(event, type) {
		event['business'] = this.formOptions['business'];
		event['start_time_init'] = this.formOptions['start_time'];
		event['end_time_init'] = this.formOptions['end_time'];
		this.graphDataZoom[type] = event;		

	}

	handleMouseUp(mouseUpEvent) {
		this.isMouseDown = false;
	}

	handleMouseDown(mouseDownEvent) {
		this.isMouseDown = true;
	}

	openPerfFilter() {
		this.isFilterCollapsed = !this.isFilterCollapsed;
	}

	addDynamicTab(options) {
		this.staticTab['active'] = false;
		const newTabIndex = this.dynamicTabs.length + 1;
		options['disabled'] = false;
		options['removable'] = true;
		this.dynamicTabs.push(options);
		this.dynamicTabs[newTabIndex - 1].active = false;
		document.body.scrollTop = 0;
	}

	openDynamicLogsTab(type, typeTitle) {
		if(!this.graphDataZoom[type]) {
			this.emulateGraphDataZoom({start: 0, end: 100}, type);
		}
		var options = {
			title: 'Raw Logs',
			tabType: '',
			graphDataZoom: this.graphDataZoom[type],
			type: 'log' 
		};
		this.addDynamicTab(options);
	}
	openTop10Tab(type, typeTitle) {
		if(!this.graphDataZoom[type]) {
			this.emulateGraphDataZoom({start: 0, end: 100}, type);
		}
		var options = {
			title: typeTitle,
			tabType: '',
			graphDataZoom: this.graphDataZoom[type],
			type: 'top10'  
		};
		this.addDynamicTab(options);
	}

	// selectServer(serverData) {
		// 	this.selectedServerData = serverData;
		// }

		removeTabHandler(tab:any): void {
			const tabIndex = this.dynamicTabs.indexOf(tab);
			this.dynamicTabs.splice(tabIndex, 1);
			if (tabIndex == 0) {
				this.staticTab['active'] = true;
			} else {
				this.dynamicTabs[tabIndex - 1].active = true;   
			}
		}


	}