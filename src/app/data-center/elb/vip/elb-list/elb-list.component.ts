import { Component, Input, Output, EventEmitter, NgModule, ViewChild } from '@angular/core';
import { ELBService } from '../../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { DataMapService } from '../../../../_services/data-map.service';
import { SharedService } from '../../../../_services/shared.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { getMdCompatibilityInvalidPrefixError } from '@angular/material';
import { ELBDetailsComponent } from './elb-details/elb-details.component';

@Component({
	selector: 'elb-list',
	styles: [],
	providers: [ELBService, ErrorHandlerService, DataMapService],
	templateUrl: './elb-list.component.html'
})


export class ELBListComponent {
	@Input() elbSearchParams;
	@ViewChild('elbDetails') detailCont:ELBDetailsComponent;
	elbListParams: any;
	loading : any;
	elbListHeaders : any;
	elbList :  any;
	isDetails : boolean;
	pagination: any;
	lbTagMap :  any;
	statusIconMap :  any;
	envMap :  any;
	elbDetailsList :  any;
	checkedElb :  any;
	timerElbSum : any;
	timedOut : boolean;

	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private dataMapService : DataMapService,
		private sharedService : SharedService) {

		this.loading = {};
		this.elbListHeaders = [
			{title : '', header : ''},
			{title : 'VIP', header : 'VIP'},
			{title : 'Name', header : 'Name'},
			{title : 'Domain Name', header : 'Domain Name'},
			{title : 'Zone', header : 'Zone'},
			{title : 'Type', header : 'Type'},
			{title : 'Created At', header : 'Created At'},
			{title : 'Status', header : 'Status'},
		];
		this.elbListParams = {
			s_count: 0,
			e_count: 16
		};
		this.timedOut = false;
		this.isDetails = false;
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};
		this.elbDetailsList = {};
		this.checkedElb = {};
	}

		 
	ngOnInit(){
		// this.getELBList();
		setTimeout(() => {
			this.timedOut = true;
		},180000);
	}

	// update pagination
	updatePaginationParameters() {
		this.pagination.collectionSize = this.elbList['count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	// get elb list
	getELBList(loader) {

		this.loading['elbList'] = loader;
		if(loader){
			this.isDetails = false;
			this.elbDetailsList = {};
			this.checkedElb = {};
		}
		
		this.elbListParams['view'] = 'summary';

		this.elbService.getELBList(this.elbListParams).subscribe(data => {

			if (data && data['status'] == 1) {

				this.elbList = data;
					
				this.updatePaginationParameters();

				if(!this.timedOut){
					this.timerElbSum = Observable.timer(30000).first().subscribe(() => this.getELBList(false));
				}
				else{
					this.destroyRefresh();
				}

			} else {
				this.elbList = null;
			}
			this.loading['elbList'] = false;

		}, error => {

			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.elbList = null;
			this.loading['elbList'] = false;
		});

	}

	ngOnChanges() {
		this.pageChange(1);
	}

	ngOnDestroy(){
		this.destroyRefresh();
	}

	destroyRefresh(){
		if (this.timerElbSum) {
			this.timerElbSum.unsubscribe();
		}
	}

	// get map
	getMap(value,obj){
		let x = this.dataMapService.getMap(value,obj);
		return x;
	}

	pageChange(currPage) {

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

	createDetailObj(index){
		let detailObj;
		if(this.elbList && this.elbList.summary){
			detailObj = this.elbList.summary[index];
		}
		return detailObj;
	}

	// get elb member on click
	getElbMember(index,id){
		this.isDetails =  true;

		let detailObj = this.createDetailObj(index)
		
		this.elbDetailsList = {};
		this.elbDetailsList[id] = detailObj;
		this.checkedElb = {};
		this.checkedElb[index] = id;

		if(this.detailCont){
			this.detailCont['elbDetailsList'] = this.elbDetailsList;
			this.detailCont.onParamUpdate(this.detailCont.elbDetailsList)
		}
		
		this.sharedService.emitChange(this.elbDetailsList);
	}

	toggleSelection(index,id){
		this.isDetails =  true;
		
		let detailObj = this.createDetailObj(index)

		if(this.elbDetailsList[id]){
			delete this.elbDetailsList[id];
		}
		else{
			this.elbDetailsList[id] = detailObj;
		}
		if(this.detailCont){
			this.detailCont['elbDetailsList'] = this.elbDetailsList;
			this.detailCont.onParamUpdate(this.detailCont.elbDetailsList)
		}

		this.sharedService.emitChange(this.elbDetailsList);

		if(Object.keys(this.elbDetailsList).length === 0){
			this.isDetails =  false;
		}
		event.stopPropagation();
	}
}
