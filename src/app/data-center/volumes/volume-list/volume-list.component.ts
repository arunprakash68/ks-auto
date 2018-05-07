import { Component, OnInit, Input, Output, EventEmitter, NgModule, ViewChild } from '@angular/core';
import { ELBService } from '../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { DataMapService } from '../../../_services/data-map.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { getMdCompatibilityInvalidPrefixError } from '@angular/material';
import { VolumeDetailsComponent } from './../volume-details/volume-details.component';
@Component({
  selector: 'volume-list',
  templateUrl: './volume-list.component.html',
  providers: [ELBService, ErrorHandlerService, DataMapService],
})
export class VolumeListComponent implements OnInit {

  @Input() volumeSearchParams;
  @Output() triggerAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() volumeDetailsListupdated: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('volumeDetails') detailCont:VolumeDetailsComponent;
	volumeListParams: any;
	loading : any;
	volumeListHeaders : any;
	volumeList :  any;
	isDetails : boolean;
	pagination: any;
	lbTagMap :  any;
	statusIconMap :  any;
	envMap :  any;
	volumeDetailsList :  any;
	checkedVolume :  any;

	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private dataMapService : DataMapService) {

		this.loading = {};
		this.volumeListHeaders = [
			{title : '', header : ''},
			{title : 'Name', header : 'Name'},
			{title : 'Volume ID', header : 'Volume ID'},
      {title : 'Size', header : 'Size'},
      {title : 'Volume Type', header : 'Volume Type'},
      {title : 'Created', header : 'Created'},
      {title : 'Availability Zone', header : 'Availability Zone'},
			{title : 'State', header : 'State'},
		];
		this.volumeListParams = {
			s_count: 0,
			e_count: 16
		};
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
		this.volumeDetailsList = {};
		this.checkedVolume = {};
	}

		 
	ngOnInit(){
		// this.getVolumeList();
	}

	// update pagination
	updatePaginationParameters() {
		this.pagination.collectionSize = this.volumeList['count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	// get volume list
	getVolumeList() {

		this.loading['volumeList'] = true;
		this.isDetails = false
		this.volumeListParams['location'] = 'Mumbai';

		this.elbService.getVolumeList(this.volumeListParams).subscribe(data => {

			if (data && data['status'] == 1) {

				this.volumeList = data;
					
				this.updatePaginationParameters();
			} else {
				this.volumeList = null;
			}
			this.loading['volumeList'] = false;

		}, error => {

			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.volumeList = null;
			this.loading['volumeList'] = false;
		});

	}

	ngOnChanges() {
		this.pageChange(1);
	}

	// get map
	getMap(value,obj){
		let x = this.dataMapService.getMap(value,obj);
		return x;
	}

	pageChange(currPage) {


		this.pagination.page = currPage;
		this.volumeListParams['s_count'] = (currPage - 1) * this.pagination.pageSize;
		this.volumeListParams['e_count'] = this.volumeListParams['s_count'] + this.pagination.pageSize;
		if (this.volumeSearchParams) {
			this.volumeListParams['bu'] = this.volumeSearchParams['business'];
			this.volumeListParams['project'] = this.volumeSearchParams['project'];
			this.volumeListParams['env'] = this.volumeSearchParams['env'];
			this.volumeListParams['zone'] = this.volumeSearchParams['zone'];
		}

		this.getVolumeList();
	}

	createDetailObj(index){
		let detailObj;
		if(this.volumeList && this.volumeList.volumes){
			detailObj = this.volumeList.volumes[index];
		}
		return detailObj;
	}

	// get volume member on click
	getVolumeMember(index,id){
		this.isDetails =  true;

		let detailObj = this.createDetailObj(index)
		
		this.volumeDetailsList = {};
		this.volumeDetailsList[id] = detailObj;
		this.checkedVolume = {};
		this.checkedVolume[index] = id;

		if(this.detailCont){
			this.detailCont['volumeDetailsList'] = this.volumeDetailsList;
			this.detailCont.onParamUpdate(this.detailCont.volumeDetailsList)
		}
		
		
	}

	toggleSelection(index,id){
		this.isDetails =  true;
		
		let detailObj = this.createDetailObj(index)

		if(this.volumeDetailsList[id]){
			delete this.volumeDetailsList[id];
			if(Object.keys(this.volumeDetailsList).length > 0){
				this.volumeDetailsListupdated.emit(this.volumeDetailsList);
			}
			
			this.clearAction.emit(detailObj);
		}
		else{
			this.volumeDetailsList[id] = detailObj;
			// this.volumeDetailsListupdated.emit(this.volumeDetailsList);
			this.triggerAction.emit(this.volumeDetailsList);
		}
		if(this.detailCont){
			this.detailCont['volumeDetailsList'] = this.volumeDetailsList;
			this.detailCont.onParamUpdate(this.detailCont.volumeDetailsList)
		}

		if(Object.keys(this.volumeDetailsList).length === 0){
			this.isDetails =  false;
		}
		
		event.stopPropagation();
	}

}
