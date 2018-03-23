import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { ELBService } from '../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'elb-list',
	styles: [],
	providers: [ELBService, ErrorHandlerService],
	templateUrl: './elb-list.component.html'
})


export class ELBListComponent {
	@Input() elbSearchParams;
	elbListParams: any;
	config: any;
	elbs: any;
	elbStats: any[];
	elbStatsParams: any[];
	elbStatsError: any[];
	elbStatsLoading: any[];
	finalELBs: any;
	pagination: any;
	loading: boolean;
	elbCallError: boolean;
	test: any;
	callLogTabResize: boolean;
	loadingGraph: any[];
	chartOptions: any;
	elbStatsRefreshArray: any[];
	timerELBStats: any;
	timerELBSummary: any;
	elbSummaryData: any;
	statusIconMap: any;

	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
		this.finalELBs = {};
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};

		this.elbStats = [];
		this.elbStatsParams = [];
		this.elbStatsLoading = [];
		this.elbStatsError = [];
		this.elbStatsRefreshArray = [];
		this.loading = true;
		this.loadingGraph = [];
		this.test = [];
		this.chartOptions = {
			height: '30px',
			width: '50px',
			xAxisShow: false,
			yAxisShow: false,
			legend: {
				show: false
			},
			grid: {
				top: '10%',
				bottom: '10%',
				right: 'auto',
				left: 'auto',
			},
			toolbox: {
				show: false
			},
			tooltip: {
				show: false
			},
			isMinData: true
		}
		this.elbListParams = {
			s_count: 0,
			e_count: 16
		};
		this.statusIconMap = {
			'UP': 'circle green',
			'DOWN': 'circle red',
			'OUT OF SERVICE': 'exclamation-triangle'

		}
		// this.getELBList();
	}

	hashCode(str) { // java String#hashCode
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		return hash;
	}

	intToRGB(str) {
		let strLower = str ? str.toLowerCase() : '';
		const i = this.hashCode(strLower);
		var c = (i & 0x00FFFFFF)
			.toString(16)
			.toUpperCase();
		let code = "00000".substring(0, 6 - c.length) + c;
		return '#' + code + 'd4';
	}

	ngOnChanges() {
		this.pageChange(1);
	}

	ngOnDestroy() {
		if (this.timerELBStats) {
			this.timerELBStats.unsubscribe();
		}
		if (this.timerELBSummary) {
			this.timerELBSummary.unsubscribe();
		}
	}

	triggerELBStats(index, currentELB) {
		this.finalELBs.summary[index].expandDetails = !this.finalELBs.summary[index].expandDetails;

		let paramsObj = {
			index: index,
			zone: currentELB['zone'],
			vip: currentELB['vip']
		}

		if (!this.finalELBs['summary'][index]['expandDetails']) {
			let idx = this.elbStatsRefreshArray.findIndex(obj => obj.index === index);
			if (idx > -1)
				this.elbStatsRefreshArray.splice(idx, 1)
			return;
		}
		else {
			this.elbStatsRefreshArray = [...this.elbStatsRefreshArray, paramsObj]
		}

		let currentElbStat = [paramsObj]
		this.getELBStats(currentElbStat);
	}

	getCheckedArr(arr, index) {
		if (arr && !arr[index]) {
			arr[index] = {};
		}
		return arr;
	}
	refreshELBStats() {
		if (this.timerELBStats) {
			this.timerELBStats.unsubscribe();
		}
		this.timerELBStats = Observable.timer(20000).first().subscribe(() => this.getELBStats(this.elbStatsRefreshArray));
	}

	getELBStats(currentElbStat) {

		let observablesList = currentElbStat.map((obj: any) => {

			this.elbStatsLoading[obj.index] = false;
			this.elbStatsError[obj.index] = false;
			// this.elbStats[obj.index] = null;
			this.elbStatsParams[obj.index] = {
				location: obj.zone,
				vipip: obj.vip.toString(),
				statstype: ''
			};

			return this.elbService.getELBStats(this.elbStatsParams[obj.index])
				.catch(data => Observable.of([]))
		});

		Observable.forkJoin(observablesList).subscribe(data => {

			for (let i = 0; i < data.length; i++) {
				let idx = currentElbStat[i].index;
				this.elbStatsLoading[idx] = false;

				if (data[i] && data[i]['status'] == 1) {
					this.elbStats[idx] = data[i]['vipdetailed'];
				} else {
					this.elbStatsLoading[idx] = false;
					this.elbStatsError[idx] = true;
					this.elbStats[idx] = null;
				}
			}
			this.refreshELBStats();

		}, error => {
			for (let i = 0; i < currentElbStat.length; i++) {
				let idx = currentElbStat[i].index;

				this.elbStatsLoading[idx] = false;
				this.elbStatsError[idx] = true;
				this.elbStats[idx] = null;
			}

		})

	}

	getZoneStats(data) {
		let zoneMap = {};
		for (let i = 0; i < data['summary'].length; i++) {
			if (!zoneMap[data['summary'][i].zone]) { zoneMap[data['summary'][i].zone] = [] }
			zoneMap[data['summary'][i].zone] = [...zoneMap[data['summary'][i].zone], data['summary'][i].vip]
		}
		if (Object.keys(zoneMap).length > 0) {
			let detailedSummary = [Observable.of(data)];
			let zoneArray = Object.keys(zoneMap).map((key: any) => {
				return this.elbService.getELBStats({
					location: key,
					vipip: zoneMap[key].toString(),
					statstype: 'summary'
				})
					.map((zoneData: any) => {
						return zoneData.vipdetailed;
					})
					.catch(zoneData => Observable.of([]))
			})

			detailedSummary = detailedSummary.concat(zoneArray)
			return Observable.forkJoin(detailedSummary);
		}
		else {
			return Observable.of(data);
		}
	}

	getELBList(isPageChanged) {

		this.elbCallError = false;

		let elbSummaryObservable = this.elbService.getELBList(this.elbListParams);

		let elbSummary;
		if (!this.elbSummaryData || isPageChanged) {
			this.loading = true;
			elbSummary = elbSummaryObservable.flatMap((data) => {
				this.elbSummaryData = data;
				return this.getZoneStats(data);
			});
		}
		else {
			elbSummary = this.getZoneStats(this.elbSummaryData);
		}


		elbSummary.subscribe(data => {
			let stats;
			if (data.length > 0) {
				stats = data.slice(1).reduce(
					function (ar1, ar2) {
						return ar1.concat(ar2);
					}, []
				);
			}
			else {
				this.elbs = null;
				this.finalELBs = null;
			}


			if (this.elbSummaryData && this.elbSummaryData['status'] == 1) {
				const emptyString = '-';
				let elbStatObj;
				this.elbs = this.elbSummaryData;
				if (!this.finalELBs) {
					this.finalELBs = {};
				}
				this.finalELBs['status'] = 1;
				this.finalELBs['count'] = this.elbs['count'];
				if (isPageChanged) {
					this.finalELBs['summary'] = [];
				}

				for (let i = 0; i < this.elbSummaryData['summary'].length; i++) {
					let index = stats.findIndex(obj => {
						return this.elbSummaryData['summary'][i].vip == obj.ip && this.elbSummaryData['summary'][i].port == obj.port;
					})
					if (index > -1) {
						elbStatObj = {
							CurrentClientConnections: stats[index].CurrentClientConnections,
							EstablishedConnections: stats[index].EstablishedConnections,
							requestsrate: stats[index].requestsrate,
							responsesrate: stats[index].responsesrate,
							totalrequests: stats[index].totalrequests,
							totalresponses: stats[index].totalresponses,
							state: stats[index].state
						}
					}
					else {
						elbStatObj = {
							CurrentClientConnections: emptyString,
							EstablishedConnections: emptyString,
							requestsrate: emptyString,
							responsesrate: emptyString,
							totalrequests: emptyString,
							totalresponses: emptyString,
							state: emptyString
						}
					}

					if (!isPageChanged) {
						this.finalELBs['summary'][2 * i] = { ...this.finalELBs['summary'][2 * i], ...elbStatObj }
					}
					else {
						this.elbSummaryData['summary'][i] = { ...this.elbSummaryData['summary'][i], ...elbStatObj };

						this.finalELBs['summary'][2 * i] = this.elbSummaryData['summary'][i];
						this.finalELBs['summary'][2 * i]['expandDetails'] = false;
						this.finalELBs['summary'][2 * i]['dynamicRow'] = false;
						this.finalELBs['summary'][(2 * i) + 1] = { expandDetails: false, dynamicRow: true };
					}
					// for(let j = 0; j < this.finalELBs['result'][(2 * i) + 1]['zone_list'].length; j++) {
					// 	this.getCheckedArr(this.elbStatsLoading, (2 * i) + 1)[(2 * i) + 1][this.finalELBs['result'][(2 * i) + 1]['zone_list'][j]['DIID']] = true;
					// 	this.getCheckedArr(this.elbStatsError, (2 * i) + 1)[(2 * i) + 1][this.finalELBs['result'][(2 * i) + 1]['zone_list'][j]['DIID']] = false;
					// } 
					this.loadingGraph[2 * i] = false;
					this.test[2 * i] = [{
						data: [
							[1518584700000, 10288.52],
							[1518586200000, 10677.98],
							[1518587700000, 8060.25],
							[1518589200000, 10897.97],
							[1518590700000, 10567.22],
							[1518592200000, 9983.18],
							[1518593700000, 11617.17],
							[1518595200000, 8258.55],
							[1518596700000, 10292.6],
							[1518598200000, 10601.59]
						],
						name: "Total Requests",
						xAxis: "time",
						yAxis: "Req/s"
					}]
				}
				this.updatePaginationParameters();
				if (this.timerELBSummary) {
					this.timerELBSummary.unsubscribe();
				}
				this.timerELBSummary = Observable.timer(10000, 20000).first().subscribe(() => this.getELBList(false));

			} else {
				this.elbs = null;
				this.finalELBs = null;
				this.elbCallError = true;
			}
			this.loading = false;

		}, error => {

			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.elbs = null;
			this.finalELBs = null;
			this.loading = false;
			this.elbCallError = true;
		});

	}

	updatePaginationParameters() {
		this.pagination.collectionSize = this.elbs['count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	pageChange(currPage) {

		this.elbStatsRefreshArray.length = 0;

		console.log(this.elbSearchParams);
		this.pagination.page = currPage;
		this.elbListParams['s_count'] = (currPage - 1) * this.pagination.pageSize;
		this.elbListParams['e_count'] = this.elbListParams['s_count'] + this.pagination.pageSize;
		if (this.elbSearchParams) {
			this.elbListParams['bu'] = this.elbSearchParams['business'];
			this.elbListParams['project'] = this.elbSearchParams['project'];
			this.elbListParams['env'] = this.elbSearchParams['env'];
			this.elbListParams['zone'] = this.elbSearchParams['zone'];
		}

		this.getELBList(true);
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if (this.elbCallError) {
			return false;
		}
		if (this.showNoELBMsg()) {
			return false;
		}
		return true;
	}

	showNoELBMsg() {
		return !this.loading && (this.elbs && !(this.elbs.status == 1)) || (this.elbs && (this.elbs.summary.length == 0));
	}

	showNoELBStatsMsg(index) {
		// let billDetail = null;
		// if(this.billDetails[index] && this.billDetails[index][dcZone['DIID']]) {
		// 	billDetail = this.billDetails[index][dcZone['DIID']];
		// }
		// if(billDetail && billDetail['result'] && billDetail['result'] < 1) {
		// 	return true;
		// }
		return false;
	}

	getFLoat(str) {
		return parseFloat(str);
	}

}
