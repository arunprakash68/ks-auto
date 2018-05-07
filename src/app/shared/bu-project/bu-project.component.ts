import { Component,OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { BusinessAccessDetailsService } from '../../_services/business-access-details.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';

@Component({
	selector: 'bu-project',
	styles: [],
	providers: [BusinessAccessDetailsService, ErrorHandlerService],
	templateUrl: './bu-project.component.html'

})

export class BuProjectComponent implements OnInit {
	@Input() selectionType: any;
	@Input() access: any;
	@Input() isProject: boolean;
	@Input() formData : any;
	@Output() businessChange: EventEmitter<any> = new EventEmitter<any>();
	@Output() projectChange: EventEmitter<any> = new EventEmitter<any>();
	@Output() updateData: EventEmitter<any> = new EventEmitter<any>();

	loading : any;
	loadingError : any;
	projects : any;
	businessAccessDetails :  any;

	constructor(private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private businessAccessDetailsService : BusinessAccessDetailsService){

		this.loading = {};
		this.loadingError = {};
		this.projects = {};

	}
	

	ngOnInit() {
		this.getBusinessAccessDetails();
	}

	ngOnChanges(changes: SimpleChanges) {
	}

	getBusinessAccessDetails() {
		this.loading['bu'] = true;
		this.loadingError['bu'] = false;
		this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
			this.loading['bu'] = false;
			if(data && data['bu'] && data['status'] != 0) {
				this.businessAccessDetails = data;
				this.fillProjectsMap();
				
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

	onBusinessChange() {
		if(this.selectionType == 'all'){
			this.formData['project'] = '';
		}
		else{
			this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
		}
		
		this.businessChange.emit(this.formData)
	}

	onProjectChange(){
		this.projectChange.emit(this.formData)
	}


	updateDefaultFormData() {
		if(this.selectionType == 'default'){
			if (this.businessAccessDetails['bu'].length > 0) {
				this.formData['bu'] = this.businessAccessDetails['bu'][0]['bu_name'];
			}
			if(this.projects && this.projects[this.formData['bu']].length > 0) {
				this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
			}
		}
		else if(this.selectionType == 'all'){
			this.formData = {
				bu : '',
				project : ''
			}
		}
	}

	fillProjectsMap() {
		let bu = this.businessAccessDetails['bu'];
		let access = this.access;
		for(let i = 0; i < bu.length; i++) {
			this.projects[bu[i]['bu_name']] = (bu[i]['project']).filter(function(obj){
				if(access == 'write')
					return (obj.access_type).indexOf('w') > -1
				else
					return (obj.access_type).indexOf('r') > -1
			});
		}
		
		let data = {
			businessAccessDetails : this.businessAccessDetails,
			projects : this.projects
		}
		this.updateData.emit(data)
		this.updateDefaultFormData();
	}

}