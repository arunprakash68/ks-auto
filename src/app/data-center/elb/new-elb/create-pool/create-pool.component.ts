import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ELBService } from '../../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../../_services/services-utility.service';
import { ServerListService } from '../../../../_services/servers-list.service';

import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'create-pool',
	styles: [],
	providers: [ServicesUtilityService, ErrorHandlerService, ServerListService,ELBService],
	templateUrl: './create-pool.component.html'
})

export class CreatePoolComponent implements OnInit {
	lbMethodList: any;
	ports: any;
	vipmembers: any;
	loading : any;
	loadingError : any;
	locationMap : any;


	@Input() formData: any;
	@Input() currentLocZone: any;
	@Input() currentBuProject: any;
	@Output() sendFormData: EventEmitter<any> = new EventEmitter<any>();

	constructor(private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
		private serverListService: ServerListService,
		private elbService: ELBService,
        private router: Router){

			this.loading = {};
			this.loadingError = {};
			this.ports = [80,443,8080,3000];
			this.locationMap = {
				mumbai : 1,
				chennai : 2
			}
			
		}
	
	ngOnInit(){
		this.formData.port = this.ports[0];
		this.formData.vipmembers = [];
	}

	ngOnChanges() {	
		if(this.currentLocZone && this.currentLocZone.location){
			this.getLBMethodList();
			if(this.currentBuProject){
				this.getServersList();
			}
		}
		
	}
	
	getServersList(){
		this.loading['servers'] = true;
		this.loadingError['servers'] = false;

		let params = {
			business : this.formData.bu,
			project : this.formData.project,
			location : this.locationMap[(this.currentLocZone.location).toLowerCase()],
			search_value : this.formData.search_value
		}
		
		this.serverListService.getMyServers(params).subscribe(data => {

			this.loading['servers'] = false;
			this.vipmembers = data.vmdata;

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.loading['servers'] = false;
			this.loadingError['servers'] = true;
		})
	}

	getLBMethodList(){

		this.loading['lbmethods'] = true;
		this.loadingError['lbmethods'] = false;
		let param = {
			location : this.currentLocZone.location,
			zone : this.currentLocZone.zone
		};
		
		this.elbService.getLBMethods(param).subscribe(data => {
			
			this.lbMethodList = data ? data.algos : [];
			
			this.loading['lbmethods'] = false;
			this.formData.lbmethod = this.lbMethodList[0];
		
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.loading['lbmethods'] = false;
			this.loadingError['lbmethods'] = true;
		})
	}

	updateFormData(){
		this.sendFormData.emit(this.formData)
	}

	toggleSelection(ip) {
		var idx = this.formData.vipmembers.indexOf(ip);
	
		// Is currently selected
		if (idx > -1) {
		  this.formData.vipmembers.splice(idx, 1);
		}
	
		// Is newly selected
		else {
		  this.formData.vipmembers.push(ip);
		}
		this.updateFormData();
	  };

}