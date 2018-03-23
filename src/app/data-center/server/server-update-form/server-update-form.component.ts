import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { ServerUpdateService } from '../../../_services/server-update.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'server-update-form',
	styles: [],
	providers: [BusinessAccessDetailsService, ServerUpdateService, ErrorHandlerService],
	templateUrl: './server-update-form.component.html'
})

export class ServerUpdateFormComponent {
	formData: any;
	@Input() serverData: any;
	@Output() reloadServerList: EventEmitter<any> = new EventEmitter<any>();
	businessAccessDetails: any;
	projects: any;
	config: any;
	submitLoading: boolean = false;
	submitError: boolean = false;

	constructor(private businessAccessDetailsService: BusinessAccessDetailsService,
		private errorHandlerService: ErrorHandlerService,
		private serverUpdateService: ServerUpdateService,
		private router: Router) {
		this.formData = {
			projectname: null,
			bu: null,
			env: null,
			vmid: null
		};
		this.projects = {};
		this.config = {
			env: {
				'1': 'pre prod',
				'2': 'prod'
			}
		}
	}

	onSubmit() {
		console.log(this.formData);
		this.submitLoading = true;
		this.submitError = false;
		this.serverUpdateService.updateServerData(this.formData).subscribe(data => {
			
			this.submitLoading = false;
			if(data && data['status'] == 1){
				this.reloadServerList.emit(true);
			} else {
				this.submitError = true;
			}
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitLoading = false;
			this.submitError = true;
		})
	}

	ngOnChanges() {
		this.submitError = false;
		if(!this.serverData) return;
		this.formData['vmid'] = this.serverData['vm_id'];
		this.fetchServerUpdateInfo();
	}

	fetchServerUpdateInfo() {
		if(this.businessAccessDetails) {
			this.updateFormData();
			return;
		}
		this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
			
			if(data) {
				this.businessAccessDetails = data;
				console.log(data);
				this.fillProjectsMap();
				this.updateFormData();
			}
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
		})
	}

	updateFormData() {
		let env = this.serverData['vm_status'];
		if(!env) {
			env = 'PreProd';
		}
		this.formData['projectname'] = this.serverData['project'];
		this.formData['bu'] = this.serverData['bu'];
		this.formData['env'] = env;
	}

	fillProjectsMap() {
		for(let i = 0; i < this.businessAccessDetails['bu'].length; i++) {
			this.projects[this.businessAccessDetails['bu'][i]['bu_name']] = this.businessAccessDetails['bu'][i]['project'];
		}
		console.log(this.projects);

	}

	onBusinessChange() {
		if(this.projects && this.projects[this.formData['bu']].length > 0) {
			this.formData['projectname'] = this.projects[this.formData['bu']][0]['project'];
		}
	}


}