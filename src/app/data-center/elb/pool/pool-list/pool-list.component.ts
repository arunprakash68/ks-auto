import { Component, OnInit } from '@angular/core';
import { PoolService } from '../../../../_services/data-center/pool.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'pool-list',
	templateUrl: './pool-list.component.html',
	providers: [PoolService, ErrorHandlerService],
})
export class PoolListComponent implements OnInit {

	loading: any;
	loadingError : any;
	poolList: any;
	pagination: any;
	poolListParams: any;
	poolListHeaders : any;
	memberHeaders : any;
	statusIconMap :  any;
	modalRef: BsModalRef;
	currentBuProject : any;
	currentLocZone : any;
	currentMembers : any;
	formData : any;
	expandIps: any;
	textStrings: any;
	envMap: any;
	timerPoolSummary : any;
	timerPoolMember : any;
	memberRefreshArray :  any;

	constructor(private poolService: PoolService,
			private errorHandlerService: ErrorHandlerService,
			private router: Router,
			private modalService: BsModalService) {

		this.expandIps = {}
		this.loading = {};
		this.loadingError = {};
		this.memberRefreshArray = [];
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};
		this.poolListParams = {
			s_count: 0,
			e_count: 16
		};
		this.poolListHeaders = [
			{title : '#', header : '#'},
			{title : 'Name', header : 'Name'},
			{title : 'Project', header : 'Project'},
			{title : 'Zone', header : 'Zone'},
			{title : 'Tag', header : 'Tag'},
			{title : 'Port', header : 'Port'},
			{title : 'VIP Attached', header : 'VIP Attached'},
			{title : 'Status', header : 'Status'},
			{title : '', header : ''},
		];
		this.memberHeaders = [
			{title : '#', header : '#'},
			{title : 'IP', header : 'IP'},
			{title : 'Port', header : 'Port'},
			{title : 'Status', header : 'Status'},
			{title : 'Enable/Disable', header : 'Enable/Disable'},
			{title : 'Delete', header : 'Delete'},
		];
		this.statusIconMap = {
			'UP': 'circle green',
			'DOWN': 'circle red',
			'OUT OF SERVICE': 'exclamation-triangle',
			'PARTIAL-UP' : 'circle yellow',
			'PARTIAL-DOWN' : 'circle dark-yellow',
			'up': 'circle green',
			'down': 'circle red',
		}
		this.formData = {}
		this.textStrings = {};
		this.envMap = {
			1 : 'prod',
			2 : 'preprod',
			3 : 'staging',
			4 : 'qa',
			5 : 'dr'
		}
	}

	ngOnInit() {
		this.getPoolSummaryList();
	}

	ngOnChanges() {
		this.pageChange(1);
	}

	ngOnDestroy() {
		if (this.timerPoolMember) {
			this.timerPoolMember.unsubscribe();
		}
		if (this.timerPoolSummary) {
			this.timerPoolSummary.unsubscribe();
		}
	}

	updatePaginationParameters() {
		this.pagination.collectionSize = this.poolList['count'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	pageChange(curPage){

		this.pagination.page = curPage;

		this.poolListParams['s_count'] = (curPage - 1) * this.pagination.pageSize;
		this.poolListParams['e_count'] = this.poolListParams['s_count'] + this.pagination.pageSize;

		if (this.timerPoolSummary) {
			this.timerPoolSummary.unsubscribe();
		}

		this.getPoolSummaryList()
	}

	getPoolSummaryList(){
		let params = {
			bu : '',
			project : '',
			zone : '',
			env : '',
		}

		params = {...this.poolListParams,...params}
		
		if(!this.timerPoolSummary){
			this.loading['poolList'] = true;
		}

		
		this.loadingError['poolList'] =  false;
		this.loading['membersList'] = {}
		this.loadingError['membersList'] = {}
		

		this.poolService.getPoolSummary(params).subscribe(data => {

			if(data && data.summary){
				if(!this.timerPoolSummary){
					this.poolList = data;
				}
				else{
					for(let idx=0;idx<data.summary.length;idx++){
						this.poolList.summary[idx].vipip = data.summary[idx].vipip
						this.poolList.summary[idx].status = data.summary[idx].status
					}
				}
				
				
				this.updatePaginationParameters();
				this.refreshPool('timerPoolSummary');
			}
			else{
				this.loadingError['poolList'] =  true;
			}
			this.loading['poolList'] = false;

		}, error => {
			this.loading['poolList'] = false;
			this.loadingError['poolList'] =  true;
				
		});
	}

	getPoolMembersArray(index){


		let currentPool = this.poolList.summary[index];
		// currentPool.expanded = !currentPool.expanded

		let params = {
			poolname : currentPool.sgname,
			zone : currentPool.zone,
			location : currentPool.location,
			index : index
		}
		if(!currentPool.expanded){
			let idx = this.memberRefreshArray.findIndex(obj => obj.poolname == currentPool.sgname )
			if(idx > -1){
				this.memberRefreshArray.splice(idx, 1)
			}
			return;
		}
		else{
			this.memberRefreshArray = [...this.memberRefreshArray, params]
		}

		let currentPoolMember = [params]
		this.getpoolMembers(currentPoolMember)
		
	}

	getpoolMembers(currentPoolMember){

		let observablesList = currentPoolMember.map((obj: any) => {

			if(!this.timerPoolSummary){
				this.loading['membersList'][obj.index] = true;
			}

			this.loadingError['membersList'][obj.index] = false;
			
			let params = {
				poolname : obj.poolname,   
				zone : obj.zone,
				location : obj.location,
			};

			return this.poolService.getPoolMembers(params)
				.catch(data => Observable.of([]))
		});

		Observable.forkJoin(observablesList).subscribe(data => {
			console.log(data)
			for (let i = 0; i < data.length; i++) {
				let idx = currentPoolMember[i].index;
				let currentPool = this.poolList.summary[idx];

				this.loading['membersList'][idx] = false;

				if (data[i] && data[i]['status'] == 1) {
					currentPool.members = data[i]['members'];
					for(let idx = 0; idx< currentPool.members.length ; idx++){
						let currState = currentPool.members[idx].state;
						if(currState && (currState.toLowerCase() == 'up' || currState.toLowerCase() == 'down')){
							currentPool.members[idx].enabled = true
						}
					}
				} else {
					this.loading['membersList'][idx] = false;
				}
			}
			this.refreshPool('timerPoolMember');

		}, error => {
			for (let i = 0; i < currentPoolMember.length; i++) {
				let idx = currentPoolMember[i].index;

				this.loading['membersList'][idx] = false;
				this.loadingError['membersList'][idx] =  true;
			}

		})
		
	}

	// status update of pool memeber
	statusUpdateMember(summaryIdx, memberIdx){
		
		let currentPool = this.poolList.summary[summaryIdx];
		let currentPoolMember = currentPool.members[memberIdx];

		let params = {
			poolname : currentPool.sgname,
			zone : currentPool.zone,
			location : currentPool.location,
			port : JSON.stringify(currentPoolMember.port),
			serverip : currentPoolMember.address,
			action : currentPoolMember.enabled ? 'enable' : 'disable'
		}
		

		this.poolService.actionPoolMembers(params).subscribe(data => {

			if(data && data['status'] == 1){
				this.getPoolMembersArray(summaryIdx);
			}
			else{
				currentPoolMember.enabled = !currentPoolMember.enabled
			}

		}, error => {
			currentPoolMember.enabled = !currentPoolMember.enabled
		});
	}


	// delete pool memeber
	deleteMember(summaryIdx, memberIdx, modal){
		
		let currentPool = this.poolList.summary[summaryIdx];
		let currentPoolMember = currentPool.members[memberIdx];

		this.textStrings = {
			header : 'Confirm Delete',
			confirmText : 'Are you sure, you want to delete ' + currentPoolMember.address + ' ?',
			body :  'IP :' + currentPoolMember.address + '\nSG : ' + currentPool.sgname,
			note : '*This action cannot be undone. Once a server is removed from Group, you will have to add it again to serve requests.',
			inputText : 'Enter IP to confirm',
			placeholder : 'IP',
			value : currentPoolMember.address,
			extraParams : {summaryIdx:summaryIdx,memberIdx:memberIdx},
			modal : modal
		}

		modal.showModal(this.textStrings)
		
		
	}


	confirmDelete(obj){
		let currentPool = this.poolList.summary[obj.extraParams.summaryIdx];
		let currentPoolMember = currentPool.members[obj.extraParams.memberIdx];

		let params = {
			poolname : currentPool.sgname,
			zone : currentPool.zone,
			location : currentPool.location,
			port : currentPoolMember.port,
			serverip : currentPoolMember.address,
		}

		obj.modal.hideModal()

		this.loading['membersList'][obj.extraParams.summaryIdx] = true;

		this.poolService.deletePoolMembers(params).subscribe(data => {
			if(data && data['status'] == 1){
				this.getPoolMembersArray(obj.extraParams.summaryIdx);
			}

		}, error => {
			// this.loading['membersList'][index] = false;
			// this.loadingError['membersList'][index] =  true;
				
		});
	}

	// add member to observable
	addMember(formData : any){

		this.modalRef.hide();
		this.loading['membersList'][formData.index] = true;

		this.formData = formData;
		let observables = [];
		if(formData.vipmembers){
			for(let idx = 0; idx < formData.vipmembers.length; idx++){

				let params = {
					poolname : this.formData.poolname,
					zone : this.currentLocZone.zone,
					location : this.currentLocZone.location,
					port : this.formData.port,
					serverip : formData.vipmembers[idx],
				}

				observables.push(this.poolService.addPoolMembers(params))
			}

			this.addPoolMember(observables);
		}
	}


	// add pool memeber
	addPoolMember(observables) {
		let poolIdx = this.formData.index;

		Observable.forkJoin(observables).subscribe(
			(result) => {
				this.getPoolMembersArray(poolIdx)
			}
		)
	}

	// open modal
	openAddMemberModal(template, i){

		let currentPool = this.poolList.summary[i];
		
		this.currentMembers = currentPool.members.map(function(obj){
			return obj.address
		});

		this.formData.poolname = currentPool.sgname;
		this.formData.index = i;
		this.formData.search_value = '';

		this.currentBuProject = {
			bu : currentPool.bu,
			project : currentPool.project
		}
		this.currentLocZone = {
			location : currentPool.location,
			zone : currentPool.zone
		}

		this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'custom-modal' }));
	}

	// autorefresh pool summary
	refreshPool(timer){
		if (this[timer]) {
			this[timer].unsubscribe();
		}
		if(timer == 'timerPoolSummary'){
			this[timer] = Observable.timer(300000).first().subscribe(() => this.getPoolSummaryList());
		}
		else{
			this[timer] = Observable.timer(300000).first().subscribe(() => this.getpoolMembers(this.memberRefreshArray));
		}
		
	}

}
