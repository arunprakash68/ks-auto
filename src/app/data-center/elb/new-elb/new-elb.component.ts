import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CreateNewELBService } from '../../../_services/elb-new.service';
import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { LocationZoneListService } from '../../../_services/location-zone-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

import { ImageTextBoxComponent } from '../../../shared/img-text-box/img-text-box.component';

@Component({
	selector: 'new-elb',
	styles: [],
	providers: [CreateNewELBService, ServicesUtilityService, ErrorHandlerService, LocationZoneListService,BusinessAccessDetailsService],
	templateUrl: './new-elb.component.html'
})

export class NewELBComponent implements OnInit {
	projects: any;
	businessAccessDetails: any;
	newELBData: any;
	formData: any;
	loadBalancerList : any;
	locationList: any;
	objectKeys : any;
	loading: any;
	loadingError: any;
	currentLocZone: any;
	currentBuProject: any;
	submitLoading: any;
	submitError: any;
	newVipData : any;
	newPoolData : any;
	newMonitorData : any;
	locImgMap : any;
	attachedData : any;
	spin : any;

	constructor(private createNewELBService: CreateNewELBService,
		private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
		private router: Router,
		private businessAccessDetailsService : BusinessAccessDetailsService,
		private locationZoneListService : LocationZoneListService){
			
		this.loading = {};
		this.loadingError = {};
		this.submitLoading = {};
		this.submitError = {};
		this.projects = {};
		this.attachedData = {};

		this.objectKeys = Object.keys;
		
		this.loadBalancerList = {
			application:{
				typeText:'http https',
				types:{
					http : 80,
					https : 443
				}
			},
			network:{
				typeText:'tcp',
				types:{
					tcp : ""
				}
			}
		}
		this.formData = {
			loadBalancerType : 'application',
			scheme : 'internet-facing',
			siteshield : false,
			redirection : false
		};

		this.locImgMap = {
			Chennai : 'chennai.jpg',
			Mumbai : 'mumbai.jpg'
		}

	}

	ngOnInit() {
		this.getBusinessAccessDetails();
		this.getLocationZoneList();
	}

	/*********** get busniess details *********/
	getBusinessAccessDetails() {
		this.loading['bu'] = true;
		this.loadingError['bu'] = false;
		this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
			this.loading['bu'] = false;
			if(data && data['bu'] && data['status'] != 0) {
				this.businessAccessDetails = data;
				this.fillProjectsMap();
				this.updateDefaultFormData();
				this.onBusinessChange();
			} else {
				this.loadingError['bu'] = true;
			}
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.loading['bu'] = false;
			this.loadingError['bu'] = true;
		});
	}

	updateDefaultFormData() {
		if (this.businessAccessDetails['bu'].length > 0) {
			this.formData['bu'] = this.businessAccessDetails['bu'][0]['bu_name'];
		}
	}

	fillProjectsMap() {
		for(let i = 0; i < this.businessAccessDetails['bu'].length; i++) {
			this.projects[this.businessAccessDetails['bu'][i]['bu_name']] = this.businessAccessDetails['bu'][i]['project'];
		}
	}

	onBusinessChange() {
		if(this.projects && this.projects[this.formData['bu']].length > 0) {
			this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
		}
		this.onProjectChange();
	}

	onProjectChange(){
		this.currentBuProject = {
			bu : this.formData.bu,
			project : this.formData.project
		}
	}

	updateFormData(formData : any) {
		this.formData = formData;
	}

	getLocationZoneList() {
		if(this.locationList) {
			return;
		}
		this.loading['loc'] = true;
		this.loadingError['loc'] = false;
		this.locationZoneListService.getLocationZones().subscribe(data => {
			
			if(data && data.loc){
				let list = Object.keys(data.loc).map(function(loc){
					return data.loc[loc].map(function(zone){
						return {location : loc, zone : zone}
					})
				})
				this.locationList = [].concat(...list);
			}
			else{
				this.locationList = [];
			}

			this.loading['loc'] = false;
			this.formData.locZone = this.locationList[0];
			
			this.onZoneChange();
		
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.loading['loc'] = false;
			this.loadingError['loc'] = true;
		})
	}

	// on zone location change
	onZoneChange(){
		this.formData.location = this.formData.locZone.location;
		this.formData.zone = this.formData.locZone.zone;

		this.currentLocZone = {
			location : this.formData.location,
			zone : this.formData.zone
		}
	}

	// create vip
	createVip(){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			vipname : this.formData.vipname,
			vipport : this.formData.vipport.map(String),
			project : this.formData.project,
			bu : this.formData.bu,
			env : this.formData.monitoringvalue,
			domain_name : this.formData.domain_name,
			scheme : this.formData.scheme,
			lb_method : this.formData.lbmethod,
			siteshield : (this.formData.scheme == 'internet-facing' && this.formData.loadBalancerType == 'application') ? 
							(this.formData.siteshield ? 1 : 0) : 0,
		}
		
		this.createNewELBService.createNewELBVip(options).subscribe(data => {
			this.submitLoading['createvip'] = false;
			if(data && data['status'] == 1) {
				this.newVipData = data;
				let vipnames = this.newVipData.vipnames;
				for(let idx = 0;idx<vipnames.length; idx++){
					if(vipnames[idx].indexOf('443') > -1 && this.formData.sslcert){
						this.attachSslVip(vipnames[idx]);
					}
					if(vipnames[idx].indexOf('80') > -1 && this.formData.redirection){
						this.enableRedirection(vipnames[idx]);
					}
					if(this.newPoolData){
						this.attachPoolVip(vipnames[idx]);
					}
				}
			} else {
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong while creating VIP'
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['error'] = true;
			this.submitError['message'] = 'Something went wrong while creating VIP'
			this.submitLoading['createvip'] = false;
		})
	}

	createPool(){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			port : [this.formData.port.toString()],
			vipmembers : this.formData.vipmembers,
			domain_name : this.formData.domain_name,
			lb_method : this.formData.lbmethod,
		}
		
		this.createNewELBService.createNewELBPool(options).subscribe(data => {
			this.submitLoading['createpool'] = false;
			if(data && data['status'] == 1) {
				this.newPoolData = data;
				if(this.newMonitorData && this.newPoolData){
					this.attachMonitorPool();
				}
				if(this.newVipData && this.newPoolData){
					let vipnames = this.newVipData.vipnames;
					for(let idx = 0;idx<vipnames.length; idx++){
						this.attachPoolVip(vipnames[idx]);
					}
					
				}
			} else {
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong while creating Pool'
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['error'] = true;
			this.submitError['message'] = 'Something went wrong while creating Pool'
			this.submitLoading['createpool'] = false;
		})
	}

	// create monitor
	createMonitor(){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			send_string : this.formData.send_string,
			recv_string : this.formData.recv_string,
			domain_name : this.formData.domain_name,
		}
		
		this.createNewELBService.createNewELBMonitor(options).subscribe(data => {
			this.submitLoading['createmonitor'] = false;
			if(data && data['status'] == 1) {
				this.newMonitorData = data;
				if(this.newMonitorData && this.newPoolData){
					this.attachMonitorPool();
				}
			} else {
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong while creating Monitor'
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['error'] = true;
			this.submitError['message'] = 'Something went wrong while creating Monitor'
			this.submitLoading['createmonitor'] = false;
		})
	}

	// attach monitor to pool
	attachMonitorPool(){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			monitorname : this.newMonitorData.monitorname,
			poolname : this.newPoolData.servicegroup
		}
		
		this.createNewELBService.attachMonitorPool(options).subscribe(data => {
			this.submitLoading['attachmtop'] = false;
			if(data && data['status'] == 1) {
				this.attachedData.isMonAttached = true;
			} else {
				this.attachedData.isMonAttached = false;
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong while attaching monitor to pool'
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['error'] = true;
			this.submitError['message'] = 'Something went wrong while attaching monitor to pool'
			this.submitLoading['attachmtop'] = false;
		})
	}

	// attach vip to pool
	attachPoolVip(vipname){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			vipname : vipname,
			poolname : this.newPoolData.servicegroup
		}
		
		this.createNewELBService.attachPoolVip(options).subscribe(data => {
			this.submitLoading['attachptov'] = false;
			if(data && data['status'] == 1) {
				this.attachedData.isPoolAttached = true;
			} else {
				this.attachedData.isPoolAttached = false;
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong while attaching Pool to Vip'
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['error'] = true;
			this.submitError['message'] = 'Something went wrong while attaching Pool to Vip'
			this.submitLoading['attachptov'] = false;
		})
	}

	attachSslVip(vipname){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			vipname : vipname,
			sslcertname : this.formData.sslcert
		}
		
		this.createNewELBService.attachSslVip(options).subscribe(data => {
			this.submitLoading['attachssl'] = false;
			if(data && data['status'] == 1) {
				this.attachedData.isSslAttached = true;
			} else {
				this.attachedData.isSslAttached = false;
				this.submitError['attachssl'] = true;
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['attachssl'] = true;
			this.submitLoading['attachssl'] = false;
		})
	}

	enableRedirection(vipname){
		let options = {
			zone : this.formData.zone,
			location : this.formData.location,
			vipname : vipname
		}
		
		this.createNewELBService.sslRedirect(options).subscribe(data => {
			this.submitLoading['redirectssl'] = false;
			if(data && data['status'] == 1) {
				this.attachedData.isSslRedirect = true;
			} else {
				this.attachedData.isSslRedirect = false;
				this.submitError['redirectssl'] = true;
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError['redirectssl'] = true;
			this.submitLoading['redirectssl'] = false;
		})
	}

	// on submit
	onCreate(){
		let data = this.formData;
		if(!data.domain_name || !data.send_string || !data.recv_string){
			alert("All input fields are required");
			return;
		}
		if(data.vipport.length == 0){
			alert("Please select vip port");
			return;
		}
		if(data.vipmembers.length == 0){
			alert("Please select VIP Members");
			return;
		}
		this.spin = true;
		this.createVip();
		this.createPool();
		this.createMonitor();
	}

}