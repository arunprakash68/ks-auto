import { Component, Input, Output, EventEmitter, TemplateRef, SimpleChanges } from '@angular/core';

import { ServerStatsService } from '../../../_services/server-stats.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'server-stats',
	styles: [],
	providers: [ServerStatsService, ErrorHandlerService],
	templateUrl: './server-stats.component.html'
})

export class ServerStatsComponent {
	serverStats: any;
	loading: any;
	loadingError: any;
	callOptions: any;
	timeRangeTabs: any;
	chartOptions: any;
	@Input() graphParams: any;
	@Input() callResize: boolean;
	
	constructor(private serverStatsService: ServerStatsService, private errorHandlerService: ErrorHandlerService, 
		private router: Router) {
		this.serverStats = {
			cpu: [],
			mem: [],
			disk: [],
			swap: [],
			system: [],
			mysql: [],
			mysql_info_schema: []
		};
		this.loading = {
			cpu: true,
			mem: true,
			disk: true,
			swap: true,
			system: true,
			mysql: true,
			mysql_info_schema: true
		};
		this.loadingError = {
			cpu: false,
			mem: false,
			disk: false,
			swap: false,
			system: false,
			mysql: false,
			mysql_info_schema: false
		};
		this.callOptions = {};
		this.chartOptions = {
			height:'350px',
			width:'100%',
			xAxisShow : true,
			yAxisShow : true,
			legend : {
				show : true
			},
			grid : {},
			toolbox : {
				show : true
			},
			tooltip: {
				show : true
			},
			isMinData : false
		}
	}

	ngOnChanges(changes: SimpleChanges){
		let callResizeValues = changes['callResize'];
		let currentDate = new Date();
		this.callOptions['end_time'] = Math.round(currentDate.getTime() / 1000);
		currentDate.setHours(currentDate.getHours() - 0.5);
		this.callOptions['start_time'] = Math.round(currentDate.getTime() / 1000);
		if(callResizeValues && callResizeValues.firstChange){
			this.getStatsData(); 
		}
	}

	getCPUData() {
		this.callOptions['metric'] = 'cpu';
		this.serverStats['cpu'] = [];
		this.loading['cpu'] = true;
		this.loadingError['cpu'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			if (data) {
				
				for(let prop in data) {
					switch (prop) {
						case 'usage_system':
						let systemData = {
							name: 'System Usage',
							data: data['usage_system']
						};
						this.serverStats['cpu'].push(systemData);
						break;
						case 'usage_user':
						let userUsage = {
							name: 'User Usage',
							data: data['usage_user']
						};
						this.serverStats['cpu'].push(userUsage);
						break;
					}
				}
			}
			this.loading['cpu'] = false;
		}, error => {
			// if (!this.errorHandlerService.validateAuthentication(error)) {
   //      		this.router.navigate(['/login']);
   //     		}
   this.loading['cpu'] = false;
   this.loadingError['cpu'] = true;
});
	}

	getMemoryData() {
		this.callOptions['metric'] = 'mem';
		this.serverStats['mem'] = [];
		this.loading['mem'] = true;
		this.loadingError['mem'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			if (data) {
				for(let prop in data) {
					switch (prop) {
						case 'available':
						let availableData = {
							name: 'Memory Available',
							data: data['available']
						};
						this.serverStats['mem'].push(availableData);
						break;
						case 'used':
						let usedData = {
							name: 'Memory Used',
							data: data['used']
						};
						this.serverStats['mem'].push(usedData);
						break;
					}
				}
			}
			this.loading['mem'] = false;
		}, error => {
			this.loading['mem'] = false;
			this.loadingError['mem'] = true;
		});
	}

	getMYSQLSchemaData() {
		this.callOptions['metric'] = 'mysql_info_schema';
		this.serverStats['mysql_info_schema'] = [];
		this.loading['mysql_info_schema'] = true;
		this.loadingError['mysql_info_schema'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			console.log(data);
			if (data) {
				for(let prop in data) {
					switch (prop) {
						case 'threads_closing_tables':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Closing Tables',
							data: data['threads_closing_tables']
						});
						break;
						case 'threads_copying_to_tmp_table':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Copying to Tmp Table',
							data: data['threads_copying_to_tmp_table']
						});
						break;
						case 'threads_end':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads End',
							data: data['threads_end']
						});
						break;
						case 'threads_login':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Login',
							data: data['threads_login']
						});
						break;
						case 'threads_reading_from_net':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Reading from Net',
							data: data['threads_reading_from_net']
						});
						break;
						case 'threads_sending_data':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Sending Data',
							data: data['threads_sending_data']
						});
						break;
						case 'threads_sorting_result':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Sorting Result',
							data: data['threads_sorting_result']
						});
						break;
						case 'threads_updating':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Updating',
							data: data['threads_updating']
						});
						break;
						case 'threads_waiting_for_lock':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Waiting for Lock',
							data: data['threads_waiting_for_lock']
						});
						break;
						case 'threads_writing_to_net':
						this.serverStats['mysql_info_schema'].push({
							name: 'Threads Writing to Net',
							data: data['threads_writing_to_net']
						});
						break;
					}
				}
			}
			this.loading['mysql_info_schema'] = false;
		}, error => {
			this.loading['mysql_info_schema'] = false;
			this.loadingError['mysql_info_schema'] = true;
		});
	}

	getMYSQLData() {
		this.callOptions['metric'] = 'mysql';
		this.serverStats['mysql'] = [];
		this.loading['mysql'] = true;
		this.loadingError['mysql'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			console.log(data);
			if (data) {
				for(let prop in data) {
					switch (prop) {
						case 'created_tmp_disk_tables':
						this.serverStats['mysql'].push({
							name: 'Created Tmp Disk Tables',
							data: data['created_tmp_disk_tables']
						});
						break;
						case 'created_tmp_files':
						this.serverStats['mysql'].push({
							name: 'Created Tmp Files',
							data: data['created_tmp_files']
						});
						break;
						case 'created_tmp_tables':
						this.serverStats['mysql'].push({
							name: 'Created Tmp Tables',
							data: data['created_tmp_tables']
						});
						break;
						case 'qcache_hits':
						this.serverStats['mysql'].push({
							name: 'QCache Hits',
							data: data['qcache_hits']
						});
						break;
						case 'qcache_inserts':
						this.serverStats['mysql'].push({
							name: 'QCache Inserts',
							data: data['qcache_inserts']
						});
						break;
						case 'qcache_lowmem_prunes':
						this.serverStats['mysql'].push({
							name: 'QCache Lowmem Prunes',
							data: data['qcache_lowmem_prunes']
						});
						break;
						case 'qcache_not_cached':
						this.serverStats['mysql'].push({
							name: 'QCache Not Cached',
							data: data['qcache_not_cached']
						});
						break;
						case 'qcache_queries_in_cache':
						this.serverStats['mysql'].push({
							name: 'QCache Queries in Cache',
							data: data['qcache_queries_in_cache']
						});
						break;
						case 'slave_running':
						this.serverStats['mysql'].push({
							name: 'Slave Running',
							data: data['slave_running']
						});
						break;
						case 'threads_connected':
						this.serverStats['mysql'].push({
							name: 'Threads Connected',
							data: data['threads_connected']
						});
						break;
					}
				}
			}
			this.loading['mysql'] = false;
		}, error => {
			this.loading['mysql'] = false;
			this.loadingError['mysql'] = true;
		});
	}

	getDiskData() {
		this.callOptions['metric'] = 'disk';
		this.serverStats['disk'] = [];
		this.loading['disk'] = true;
		this.loadingError['disk'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			if (data) {
				// if (!this.errorHandlerService.validateAuthentication(data)) {
    //     			 this.router.navigate(['/login']);
    //    			}
    for(let prop in data) {
    	let diskData = {
    		name: prop,
    		data: data[prop]
    	};
    	this.serverStats['disk'].push(diskData);
    }
}
this.loading['disk'] = false;
}, error => {
	this.loading['disk'] = false;
	this.loadingError['disk'] = true;
});
	}

	getSwapData() {
		this.callOptions['metric'] = 'swap';
		this.serverStats['swap'] = [];
		this.loading['swap'] = true;
		this.loadingError['swap'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			if (data) {
				// if (!this.errorHandlerService.validateAuthentication(data)) {
    //     			 this.router.navigate(['/login']);
    //    			}
    for(let prop in data) {
    	switch (prop) {
    		case 'free':
    		let freeData = {
    			name: 'Swap Free',
    			data: data['free']
    		};
    		this.serverStats['swap'].push(freeData);
    		break;
    		case 'used':
    		let usedData = {
    			name: 'Swap Used',
    			data: data['used']
    		};
    		this.serverStats['swap'].push(usedData);
    		break;
    	}
    }
}
this.loading['swap'] = false;
}, error => {
	this.loading['swap'] = false;
	this.loadingError['swap'] = true;
});
	}

	getSystemData() {
		this.callOptions['metric'] = 'system';
		this.serverStats['system'] = [];
		this.loading['system'] = true;
		this.loadingError['system'] = false;
		this.serverStatsService.getServerStats(this.callOptions).subscribe(data => {
			if (data) {
				// if (!this.errorHandlerService.validateAuthentication(data)) {
    //     			 this.router.navigate(['/login']);
    //    			}
    for(let prop in data) {
    	switch (prop) {
    		case 'load1':
    		let loadData1 = {
    			name: 'Load1',
    			data: data['load1']
    		};
    		this.serverStats['system'].push(loadData1);
    		break;
    		case 'load5':
    		let loadData5 = {
    			name: 'Load5',
    			data: data['load5']
    		};
    		this.serverStats['system'].push(loadData5);
    		break;
    		case 'load15':
    		let loadData15 = {
    			name: 'Load15',
    			data: data['load15']
    		};
    		this.serverStats['system'].push(loadData15);
    		break;
    	}
    }
}
this.loading['system'] = false;
}, error => {
	this.loading['system'] = false;
	this.loadingError['system'] = true;
});
	}

	getStatsData() {
		if (!this.callOptions) {
			this.callOptions = {
				hostname: this.graphParams['ip']
			}
		}
		this.callOptions['hostname'] = this.graphParams['ip'];

		this.getCPUData();
		this.getMemoryData();
		this.getDiskData();
		this.getSwapData();
		this.getSystemData();
		this.getMYSQLData();
		this.getMYSQLSchemaData();
	}

	checkTimeRange(timeRange) {
		let currentDate = new Date();
		this.callOptions['end_time'] = Math.round(currentDate.getTime() / 1000);
		currentDate.setHours(currentDate.getHours() - timeRange.value);
		this.callOptions['start_time'] = Math.round(currentDate.getTime() / 1000);
		this.getStatsData();
	}


}