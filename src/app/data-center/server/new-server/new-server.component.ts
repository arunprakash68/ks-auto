import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { CreateNewServerService } from '../../../_services/server-new.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

import { ImageTextBoxComponent } from '../../../shared/img-text-box/img-text-box.component';
import { VMTypeInfoComponent } from './vm-type-info/vm-type-info.component';

@Component({
	selector: 'new-server',
	styles: [],
	providers: [CreateNewServerService, ServicesUtilityService, BusinessAccessDetailsService, ErrorHandlerService],
	templateUrl: './new-server.component.html'
})

export class NewServerComponent implements OnInit {
	businessAccessDetails: any;
	projects: any;
	newServerData: any;
	formData: any;
	datacenters: any;
	datacenterZones: any;
	osTypes: any;
	osImages: any;
	vmTypes: any;
	advancesConfig: any;
	submitLoading: boolean = false;
	submitError: boolean = false;
	loading: any;
	loadingError: any;
	submitClicked: boolean;

	constructor(private businessAccessDetailsService: BusinessAccessDetailsService,
		private createNewServerService: CreateNewServerService,
		private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
		private router: Router){
		this.submitClicked = false;
		this.loading = {
			bu: true,
			// location: true,
			dcZone: true,
			ostype: true,
			osImage: true,
			vmtype: true
		};
		this.loadingError = {
			bu: false,
			// location: false,
			dcZone: false,
			ostype: false,
			osImage: false,
			vmtype: false
		};
		this.formData = {
			quantity: 1,
			username: this.servicesUtilityService.getUser()['userprincipalname'],
			monitoringvalue: 'Production',
			networkvalue: 1
		};
		this.projects = {};
		this.advancesConfig = {
			network: [
			{value: '', displayName: 'PUBLIC'},
			{value: '', displayName: 'PRIVATE'}
			],
			monitoring: [
			{value: '', displayName: 'PROD'},
			{value: '', displayName: 'NON PROD'}
			]
		};

	}

	ngOnInit() {
		this.populateNewServerCreateInfo();
	}

	// showCreateForm() {
	// 	if(this.submitClicked && this.newServerData && this.newServerData.data.status == 1) {
	// 		return false;
	// 	}
	// 	return true;
	// }

	onSubmit(data) {
		console.log(this.formData);
		console.log(this.servicesUtilityService.getUser());
		this.submitClicked = true;
		this.newServerData = null;
		this.submitLoading = true;
		this.submitError = false;
		const options = {
			bu: this.formData['bu'],
			project: this.formData['project'],
			vmtype: this.formData['osImage'],
			vmsize: this.formData['vmtype']['ID'],
			ostype: this.formData['ostype'],
			zone: this.formData['dcZone']['zone_name'],
			networkvalue: this.formData['networkvalue'],
			monitoringvalue: this.formData['monitoringvalue'],
			quantity: this.formData['quantity']
		};
		this.createNewServerService.createNewServer(options).subscribe(data => {
			console.log(data);
			this.submitLoading = false;
			

			if(data && data['status'] == 1) {
				this.newServerData = data;
			} else {
				this.submitError = true;
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitError = true;
			this.submitLoading = false;
		})
	}

	populateNewServerCreateInfo() {
		this.getBusinessAccessDetails();
		// this.getDatacenters();
	}

	getBusinessAccessDetails() {
		this.loading['bu'] = true;
		this.loadingError['bu'] = false;
		this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
			
			console.log('**********business Access**************')
			console.log(data);
			this.loading['bu'] = false;
			if(data && data['bu'] && data['status'] != 0) {
				this.businessAccessDetails = data;
				this.fillProjectsMap();
				this.updateFormData();
				this.onBusinessChange();
				this.getDCZones();
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

	// getDatacenters() {
	// 	this.loading['location'] = true;
	// 	this.loadingError['location'] = false;
	// 	this.datacenterListService.getDataCenters().subscribe(data => {
	// 		console.log('**********Datacenters**************')
	// 		console.log(data);
	// 		this.loading['location'] = false;

	// 		if(data) {
	// 			this.datacenters = data;
	// 			this.formData['location'] = this.datacenters[0]['ID'];
	// 		} else {
	// 			this.loadingError['location'] = true;		
	// 		}
	// 	}, error => {
	// 		this.loading['location'] = false;
	// 		this.loadingError['location'] = true;
	// 	});
	// }

	getDCZones() {
		this.loading['dcZone'] = true;
		this.loadingError['dcZone'] = false;
		this.createNewServerService.getDCZones({bu: this.formData['bu'], project: this.formData['project']}).subscribe(data => {
			console.log('**********DC Zones**************')
			console.log(data);
			this.loading['dcZone'] = false;

			if(data && data['result'] && data['result'].length > 0) {
				this.datacenterZones = data;
				this.formData['dcZone'] = this.datacenterZones['result'][0];
			} else {
				this.loadingError['dcZone'] = true;		
			}
		}, error => {
			this.loading['dcZone'] = false;
			this.loadingError['dcZone'] = true;
		});
	}

	trackDCZone(index, currentItem) {
		return currentItem['diid'];
	}

	trackVMType(index, currentItem) {
		return currentItem['ID'];
	}

	updateFormData() {
		if (this.businessAccessDetails['bu'].length > 0) {
			this.formData['bu'] = this.businessAccessDetails['bu'][0]['bu_name'];
		}
		
	}


	getOSList() {
		if(!this.formData['dcZone']) {
			this.getDCZones();
			return;
		}
		console.log('hahah');
		this.loading['ostype'] = true;
		this.loadingError['ostype'] = false;
		this.createNewServerService.getOses({zone: this.formData['dcZone']['zone_name']}).subscribe(data => {
			console.log('**********OS List**************')
			console.log(data);
			this.loading['ostype'] = false;
			
			if(data) {
				this.osTypes = data;
				this.formData['ostype'] = data[0]['OS'];
			} else {
				this.loadingError['ostype'] = true;	
			}
		}, error => {
			this.loading['ostype'] = false;
			this.loadingError['ostype'] = true;
		});
	}

	getOSImagesList() {
		if(!this.formData['ostype']) {
			this.getOSList();
			return;
		}
		let params = {
			os: this.formData['ostype'],
			bu: this.formData['bu']
		}
		this.loading['osImage'] = true;
		this.loadingError['osImage'] = false;
		this.createNewServerService.getTemplateImages(params).subscribe(data => {
			console.log('**********OS Images List**************')
			console.log(data);
			this.loading['osImage'] = false;

			if(data) {
				this.osImages = data;
				this.formData['osImage'] = data[0]['template'];
			} else {
				this.loadingError['osImage'] = true;		
			}
		}, error => {
			this.loading['osImage'] = false;
			this.loadingError['osImage'] = true;
		});
	}

	getVMTypesList() {
		if (!this.formData['dcZone'] || !this.formData['ostype']) {
			if (!this.formData['dcZone'] && !this.formData['ostype']) {
				this.getDCZones();
				this.getOSList();
			}
			else if (!this.formData['dcZone']) {
				this.getDCZones();
			}
			else if(!this.formData['ostype']) {
				this.getOSList();
			}
			return;
		}
		this.loading['vmtype'] = true;
		this.loadingError['vmtype'] = false;
		console.log('current dcZone');
		console.log(this.formData['dcZone']);
		this.createNewServerService.getVMTypes({id: this.formData['dcZone']['dc_id'], os: this.formData['ostype']}).subscribe(data => {
			console.log('**********VM Types List**************')
			console.log(data);
			this.loading['vmtype'] = false;
			
			if(data && data.length > 0){
				this.vmTypes = data;
				this.formData['vmtype'] = data[0];
			} else {
				this.loadingError['vmtype'] = true;	
			}
		}, error => {
			this.loading['vmtype'] = false;
			this.loadingError['vmtype'] = true;
		});
	}



	// onDCChange() {
	// 	console.log(this.formData['dcZone']);
	// 	this.getOSList();
	// 	this.getVMTypesList();
	// }

	onProjectChange() {
		this.getDCZones();
	}

	onDCZoneChange() {
		console.log(this.formData['dcZone']);
		this.getOSList();
		this.getVMTypesList();
	}

	onOSChange() {
		console.log(this.formData.ostype);
		this.getOSImagesList();
		this.getVMTypesList();
	}

	fillProjectsMap() {
		let bu = this.businessAccessDetails['bu'];
		for(let i = 0; i < bu.length; i++) {
			this.projects[bu[i]['bu_name']] = (bu[i]['project']).filter(function(obj){
				return (obj.access_type).indexOf('w') > -1
			});
		}
	}

	onBusinessChange() {
		if(this.projects && this.projects[this.formData['bu']].length > 0) {
			this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
			this.onProjectChange();
		}

	}

	// goToServer(serverIP) {
	// 	console.log(serverIP);
	// }

}