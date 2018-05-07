import { Component, OnInit, Input, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { ServerMonitoringService } from '../../../../_services/monitoring-service/server-monitoring.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { CapitalizeFirstPipe } from '../../../.././pipes/capitalizefirst.pipe';

@Component({
  selector: 'app-performance-graph',
  templateUrl: './performance-graph.component.html',
  providers: [ServerMonitoringService, ErrorHandlerService, CapitalizeFirstPipe]
})
export class PerformanceGraphComponent implements OnInit, OnChanges {
  @Input() perfFilterOptions: any;
  @Input() tabselected: any;

  
  tabsList: any;
	options: any;
	logsCallError: any;

	iniparam: any;
  

  serverMonitoringData: any;
  loading: any;
  loadingError: any;
  graphDataZoom: any;
	tabperformance: any;
	callLogTabResize: number;
	isMouseDown: any;


  constructor(private capitalizeFirstPipe: CapitalizeFirstPipe, private serverMonitoringService: ServerMonitoringService, private errorHandlerService: ErrorHandlerService) { 
    this.tabsList = [
			{template : 'CITY',active:true},
			{template : 'COUNTRY',active:false},
			{template : 'ISP',active:false},
		];
		this.options = {};
		this.callLogTabResize = 0;
    
    this.tabperformance = 'performance';
    
    this.serverMonitoringData = {
      'CITY' : {totalRequest: [], averageRequestTime: []},
      'COUNTRY' : {totalRequest: [], averageRequestTime: []},
      'ISP' : {totalRequest: [], averageRequestTime: []}
		};
		this.loading = {
      'CITY': {totalRequest: true, averageRequestTime: true},
      'COUNTRY': {totalRequest: true, averageRequestTime: true},
      'ISP': {totalRequest: true, averageRequestTime: true}
			
		};
		this.loadingError = {
      'CITY': {totalRequest: false, averageRequestTime: false},
      'COUNTRY': {totalRequest: false, averageRequestTime: false},
      'ISP': {totalRequest: false, averageRequestTime: false}
			
		};
		this.graphDataZoom = {
      'CITY': {totalRequest: null, averageRequestTime: null},
      'COUNTRY': {totalRequest: null, averageRequestTime: null},
      'ISP': {totalRequest: null, averageRequestTime: null}
		};
  }

  ngOnInit() {
    
  }

  ngOnChanges(change: SimpleChanges) {
		this.callLogTabResize = this.callLogTabResize+1;
		if(change['perfFilterOptions'] && change['perfFilterOptions']['currentValue'] && change['perfFilterOptions']['previousValue'] && change['perfFilterOptions']['currentValue'].tab === 'performance') {
      // console.log('if', this.perfFilterOptions);
      delete this.perfFilterOptions.tab;
			this.tabsList = [
			{template : 'CITY',active:true},
			{template : 'COUNTRY',active:false},
			{template : 'ISP',active:false},
			];
			
    this.options = {};
    this.serverMonitoringData = {
      'CITY' : {totalRequest: [], averageRequestTime: []},
      'COUNTRY' : {totalRequest: [], averageRequestTime: []},
      'ISP' : {totalRequest: [], averageRequestTime: []}
		};
		this.getGraphsdata('CITY');
		
		}
		else if(change['tabselected'] && (change['tabselected']['currentValue'] === 'performance') && (this.serverMonitoringData['CITY'].totalRequest.length === 0)){
      // console.log('else if', this.perfFilterOptions);
      // this.perfFilterOptions = change['perfFilterOptions']['previousValue'];
      
			this.getGraphsdata('CITY');
		}
		else{
      // console.log('else', this.perfFilterOptions);
      let check = this.perfFilterOptions === undefined ? undefined : (this.perfFilterOptions.status_group === undefined) ? undefined : this.perfFilterOptions.status_group;
      if(check !== undefined){
        delete this.perfFilterOptions.status_group;
      }
      
		}	
  }
	handleMouseUp(mouseUpEvent) {
		this.isMouseDown = false;
	}

	handleMouseDown(mouseDownEvent) {
		this.isMouseDown = true;
	}
	handleGraphDataZoom(event, type) {
		let self = this;
		setTimeout(function() {
			if(!self.isMouseDown) {
				self.isMouseDown = true;
				event['business'] = self.perfFilterOptions['business'];
				event['start_time_init'] = self.perfFilterOptions['start_time'];
				event['end_time_init'] = self.perfFilterOptions['end_time'];
				self.graphDataZoom[type] = event;		
			}
		}, 500);
	}

	emulateGraphDataZoom(event, type) {
		event['business'] = this.perfFilterOptions['business'];
		event['start_time_init'] = this.perfFilterOptions['start_time'];
		event['end_time_init'] = this.perfFilterOptions['end_time'];
		this.graphDataZoom[type] = event;		

	}
  getGraphsdata(tabType: any){
    // console.log(tabType ,this.serverMonitoringData[tabType].totalRequest);
    if(tabType === 'CITY' && (this.serverMonitoringData[tabType].totalRequest.length === 0)){
      this.getCityTotalRequest(tabType);
			this.getCityAverageRequestTime(tabType);
			this.iniparam = this.perfFilterOptions;
    }
    else if(tabType === 'COUNTRY' && (this.serverMonitoringData[tabType].totalRequest.length === 0)){
      this.getCountryTotalRequest(tabType);
			this.getCountryAverageRequestTime(tabType);
			// console.log('init parama: ', this.iniparam);
    }
    else if(tabType === 'ISP' && (this.serverMonitoringData[tabType].totalRequest.length === 0)){
      this.getIspTotalRequest(tabType);
			this.getIspAverageRequestTime(tabType);
			// console.log('init parama: ', this.iniparam);
    }
    
  }
  

  getCityTotalRequest(tabType: any) {
		this.loadingError[tabType]['totalRequest'] = false;
		this.serverMonitoringData[tabType]['totalRequest'] = [];
    this.loading[tabType]['totalRequest'] = true;
		this.serverMonitoringService.getCityrequests(this.perfFilterOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['totalRequest'] = false;
					this.loadingError[tabType]['totalRequest'] = true;
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
					this.serverMonitoringData[tabType]['totalRequest'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['totalRequest'] = false;
		}, error => {
			this.loading[tabType]['totalRequest'] = false;
			this.loadingError[tabType]['totalRequest'] = true;
    });
  }

  getCityAverageRequestTime(tabType: any){
    this.loadingError[tabType]['averageRequestTime'] = false;
		this.serverMonitoringData[tabType]['averageRequestTime'] = [];
    this.loading[tabType]['averageRequestTime'] = true;
    
		this.serverMonitoringService.getCityreqtime(this.perfFilterOptions).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['averageRequestTime'] = false;
					this.loadingError[tabType]['averageRequestTime'] = true;
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
					this.serverMonitoringData[tabType]['averageRequestTime'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['averageRequestTime'] = false;
		}, error => {
			this.loading[tabType]['averageRequestTime'] = false;
			this.loadingError[tabType]['averageRequestTime'] = true;
    });
  }

  getCountryTotalRequest(tabType: any) {
		this.loadingError[tabType]['totalRequest'] = false;
		this.serverMonitoringData[tabType]['totalRequest'] = [];
    this.loading[tabType]['totalRequest'] = true;
		this.serverMonitoringService.getCountryrequests(this.iniparam).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['totalRequest'] = false;
					this.loadingError[tabType]['totalRequest'] = true;
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
					this.serverMonitoringData[tabType]['totalRequest'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['totalRequest'] = false;
		}, error => {
			this.loading[tabType]['totalRequest'] = false;
			this.loadingError[tabType]['totalRequest'] = true;
    });
  }

  getCountryAverageRequestTime(tabType: any){
    this.loadingError[tabType]['averageRequestTime'] = false;
		this.serverMonitoringData[tabType]['averageRequestTime'] = [];
    this.loading[tabType]['averageRequestTime'] = true;
    
		this.serverMonitoringService.getCountryreqtime(this.iniparam).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['averageRequestTime'] = false;
					this.loadingError[tabType]['averageRequestTime'] = true;
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
					this.serverMonitoringData[tabType]['averageRequestTime'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['averageRequestTime'] = false;
		}, error => {
			this.loading[tabType]['averageRequestTime'] = false;
			this.loadingError[tabType]['averageRequestTime'] = true;
    });
  }

  getIspTotalRequest(tabType: any) {
		this.loadingError[tabType]['totalRequest'] = false;
		this.serverMonitoringData[tabType]['totalRequest'] = [];
    this.loading[tabType]['totalRequest'] = true;
		this.serverMonitoringService.getAsnrequests(this.iniparam).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['totalRequest'] = false;
					this.loadingError[tabType]['totalRequest'] = true;
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
					this.serverMonitoringData[tabType]['totalRequest'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['totalRequest'] = false;
		}, error => {
			this.loading[tabType]['totalRequest'] = false;
			this.loadingError[tabType]['totalRequest'] = true;
    });
  }

  getIspAverageRequestTime(tabType: any){
    this.loadingError[tabType]['averageRequestTime'] = false;
		this.serverMonitoringData[tabType]['averageRequestTime'] = [];
    this.loading[tabType]['averageRequestTime'] = true;
    
		this.serverMonitoringService.getAsnreqtime(this.iniparam).subscribe(data => {
			if (data) {
				if (!data['items']) {
					this.loading[tabType]['averageRequestTime'] = false;
					this.loadingError[tabType]['averageRequestTime'] = true;
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
					this.serverMonitoringData[tabType]['averageRequestTime'].push({
						name: (key === 'top_n_average')? 'Top & Average' : this.capitalizeFirstPipe.transform(key, undefined),
						data: errorDistributionMap[key],
						xAxis: data['x-axis'],
						yAxis: data['y-axis']
					});
        }
			}
			this.loading[tabType]['averageRequestTime'] = false;
		}, error => {
			this.loading[tabType]['averageRequestTime'] = false;
			this.loadingError[tabType]['averageRequestTime'] = true;
    });
  }
  updateTabData(tabselected: any){
		this.getGraphsdata(tabselected);
		this.callLogTabResize = this.callLogTabResize+1;
  }

}
