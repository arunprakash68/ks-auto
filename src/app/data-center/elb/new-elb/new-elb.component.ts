import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CreateNewELBService } from '../../../_services/data-center/elb-new.service';
import { LocationZoneListService } from '../../../_services/location-zone-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

import { ImageTextBoxComponent } from '../../../shared/img-text-box/img-text-box.component';

@Component({
	selector: 'new-elb',
	styles: [],
	providers: [CreateNewELBService, ServicesUtilityService, ErrorHandlerService, LocationZoneListService],
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
	observables : any[];
	observablesAttach: any[];

	constructor(private createNewELBService: CreateNewELBService,
		private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
		private router: Router,
		private locationZoneListService : LocationZoneListService){
			
		this.loading = {};
		this.loadingError = {};
		this.submitLoading = {};
		this.submitError = {};
		this.projects = {};
		this.attachedData = {};
		this.observables = [];
		this.observablesAttach = [];

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
		this.getLocationZoneList();
	}

	// bu project component update
	getBuProData(data){
		this.businessAccessDetails = data.businessAccessDetails;
		this.projects = data.projects
	}

	onBusinessChange(data) {
		this.formData['bu'] = data.bu;

		if(this.projects && this.projects[this.formData['bu']].length > 0) {
			this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
		}
		this.onProjectChange(false);
	}

	onProjectChange(data){
		if(data){
			this.formData['bu'] = data.bu;
			this.formData['project'] = data.project;
		}
		this.currentBuProject = {
			bu : this.formData.bu,
			project : this.formData.project
		}
	}

	updateFormData(formData : any) {
		this.formData = formData;
	}


	

	/*********** zone mapping/ get locations *********/
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

	// check if valid domain name is entered
	validateDomain(domain){
		let domainFormat = /^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/;
		return domainFormat.test(domain)
	}

	// alert messages if requred fields are not entered
	validateFormData(){
		let data = this.formData;
		
		if(!data.domain_name || !data.send_string || !data.recv_string){
			alert("All input fields are required");
			return false;
		}
		if(!this.validateDomain(data.domain_name)){
			alert("Invalid domain name");
			return false;
		}
		if(data.vipport.length == 0){
			alert("Please select vip port");
			return false;
		}
		if(data.loadBalancerType == 'network' && (data.tcpPort == 80 || data.tcpPort == 443)){
			alert("TCP Port cannot be " + data.tcpPort)
			return;
		}
		if(data.vipmembers.length == 0){
			alert("Please select VIP Members");
			return false;
		}
		else{
			return true;
		}
	}

	// on submit
	onCreate(){
		if(!this.validateFormData()){
			return;
		}
		
		this.spin = true;
		let data =  this.formData;
		// common params
		let params = {
			zone : data.zone,
			location : data.location,
			domain_name : data.domain_name,
			vipport : data.vipport.map(String),
			project : data.project,
			bu : data.bu,
			env : parseInt(data.monitoringvalue),
			scheme : data.scheme,
			lb_method : data.lbmethod,
			siteshield : (data.scheme == 'internet-facing' && data.loadBalancerType == 'application') ? 
							(data.siteshield ? 1 : 0) : 0,
			port : [data.port.toString()],
			vipmembers : data.vipmembers,
			lb_type : data.loadBalancerType == "application" ? 'http' : 'tcp',
			send_string : data.send_string,
			recv_string : data.recv_string,
			sslcertname : data.sslcert,
			http_https_redir : data.redirection ? 1 : 0,
			waf : data.waf ? 1 : 0
		}


		this.createNewELBService.createNewELB(params).subscribe(data =>{
			if(data && data.status == 1){
				this.router.navigate(['/app/data-center/elb/vip']);
			}
			else{
				this.submitError['error'] = true;
				this.submitError['message'] = 'Something went wrong. Please try after a while.'
			}
		})
	}

}