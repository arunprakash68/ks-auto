import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../_services/shared.service';
import { ELBService } from '../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { DataMapService } from '../../../_services/data-map.service';
import { ELBListComponent } from './elb-list/elb-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'elb',
	styles: [],
	providers: [SharedService, ELBService, ErrorHandlerService, DataMapService],
	templateUrl: './elb.component.html'
})

export class ELBComponent {
	staticBillingTab: any;
	searchOptions: any;
	isCollapsed: boolean;
	formData: any;
	searchTags: any;
	envMap: any;
	actions: any[];
	elbList: any;
	isActive: boolean;
	@ViewChild('elbList') elbListInstance: ELBListComponent;

	constructor(private sharedService: SharedService,
		private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private toastrService : ToastrService,
		private dataMapService : DataMapService) {
		this.isCollapsed = false;
		this.staticBillingTab = {
			active: true
		};
		this.formData = {};
		this.searchOptions = {};
		this.searchTags = [];
		this.envMap = {
			1: 'prod',
			2: 'preprod',
			3: 'staging',
			4: 'qa',
			5: 'dr'
		}
		this.actions = [];
		this.elbList = {}
		this.sharedService.changeEmitted$.subscribe(obj => {
			this.elbList = obj;
			this.actions = Object.keys(obj);
			this.isActive = (this.actions.length == 1 && (this.elbList[this.actions[0]].state).toLowerCase() == 'active')
		})
	}

	triggerFilterCollapse(collapse: boolean) {
		this.isCollapsed = !this.isCollapsed;
	}

	updateSearchOptions(_searchOptions: any) {
		this.searchOptions = _searchOptions;

		this.updateSearchTags()
		this.triggerFilterCollapse(true)
	}

	updateSearchTags() {
		let obj = this.searchOptions;
		let map = this.envMap;
		this.searchTags = Object.keys(obj).reduce(function (filtered, option) {
			if (obj[option] != '' && option != 'start_count') {
				let tag = {
					closable: true,
					prop: option,
					title: option == 'env' ? map[obj[option]] : obj[option]
				}
				filtered.push(tag);
			}
			return filtered;
		}, []);
	}

	triggerCloseTag(tag) {
		if (tag.prop == 'business') {
			this.searchTags.length = 0;
			let count = this.searchOptions.start_count;
			this.searchOptions = {
				start_count: count
			}
		}
		else {
			for (let i = 0; i < this.searchTags.length; i++) {
				if (this.searchTags[i].prop == tag.prop) {
					this.searchTags.splice(i, 1);
					break;
				}
			}
			let temp = JSON.parse(JSON.stringify(this.searchOptions));
			temp[tag.prop] = '';
			this.searchOptions = temp;

			if (tag.prop == 'project') {
				this.triggerCloseTag({ prop: 'zone' });
			}
		}
	}

	editElb(modal) {
		modal.showModal(this.elbList[this.actions[0]])
	}

	deleteElb(modal) {

		let body = this.actions.reduce((filtered, key, i) => {
			let obj = this.elbList[key];
			if (obj.state.toLowerCase() == 'active') {
				let value = i + 1 + ') ' + obj.lb_name + ' - ' + obj.vip;
				filtered.push(value)
			}
			return filtered;
		}, []);
		console.log(body)

		let canDelete = body.length > 0;

		let textStrings = {
			header: 'Confirm Delete',
			confirmText: canDelete ? 'Are you sure, you want to delete following ELBs ?' : 'Please select ACTIVE ELBs to delete !!',
			body: body.join('\n'),
			note: '*This action cannot be undone. Once a ELB is removed, you will have to create again.',
			inputText: 'Enter VIP to confirm',
			placeholder: 'VIP',
			value: "",
			extraParams: '',
			isInput: false,
			modal: modal,
			canDelete : canDelete
		}

		modal.showModal(textStrings)
	}


	confirmDelete(obj) {

		let observableList = [];

		this.actions.map(key => {
			let obj = this.elbList[key];
			let params = {
				zone: obj.zone,
				vipport: obj.port,
				bu: obj.bu,
				project: obj.project,
				domain_name: obj.domain_name,
				lb_type: obj.protocol,
				location: this.getMap(obj.zone ,'locZoneMap'),
				ipaddress: obj.vip,
				subnetid: obj.subnet_id
			}
			
			observableList.push(this.elbService.deleteELB(params));
		})

		Observable.forkJoin(observableList).subscribe(result => {
			obj.modal.hideModal();

			let status = result.every(function(obj){return obj? obj['status'] == 1 : false});
			this.elbListInstance.getELBList(true);

			if(status){
				this.toastrService.success('All Selected ELBs Deleted', 'Deletion Successfull!!', {
					timeOut: 10000,
					positionClass: 'toast-top-right',
				});
			}
			else{
				this.toastrService.error('Something went wrong', 'Error Occured!!', {
					timeOut: 10000,
					positionClass: 'toast-top-right',
				});
			}
			
		});
	}

	// get map
	getMap(value,obj){
		let x = this.dataMapService.getMap(value,obj);
		return x;
	}


	editUpdate(obj) {
		console.log(obj);
		if (obj) {
			this.elbListInstance.getELBList(true);
		}
	}

	refreshElbList() {
		this.elbListInstance.getELBList(true);
	}


}