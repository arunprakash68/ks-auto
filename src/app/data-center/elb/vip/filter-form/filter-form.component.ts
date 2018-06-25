import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BusinessAccessDetailsService } from '../../../../_services/business-access-details.service';
import { LocationZoneListService } from '../../../../_services/location-zone-list.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
	selector: 'elb-filter-form',
	styles: [],
	providers: [BusinessAccessDetailsService, ErrorHandlerService, LocationZoneListService],
	templateUrl: './filter-form.component.html'
})

export class ELBFilterFormComponent {
	businessAccessDetails: any;
	zoneList: any;
	dataCenters: any[];
	projects: any;
	formData: any;
	envList: any[];
	searchFilters : any[];

	@Input() isCollapsed: boolean;
	@Input() updatedSearchOptions: any;
	@Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
	@Output() triggerFilterCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();


	constructor(
		private businessAccessDetailsService: BusinessAccessDetailsService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private locationZoneListService: LocationZoneListService) {
		this.formData = {};
		this.projects = {};
		this.envList = [
			{ value: 1, title: 'prod' },
			{ value: 2, title: 'pre prod' },
			{ value: 3, title: 'staging' },
			{ value: 4, title: 'qa' },
			{ value: 5, title: 'dr' }
		];

		this.searchFilters = ['Vip Ip']
	}

	ngOnInit(){
		this.formData.filterKey = this.searchFilters[0]
	}

	ngOnChanges() {
		if (this.isCollapsed) {
			this.openServerFilter();
		}
		this.updateSearchOptions();
	}

	triggerCollapse() {
		this.triggerFilterCollapse.emit(true);
	}

	openServerFilter() {
		this.getBusinessAccessDetails();
		this.getLocationZoneList();
	}

	getBusinessAccessDetails() {
		if (this.businessAccessDetails) {
			return;
		}
		this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {

			if (data && data['status'] != 0) {
				this.businessAccessDetails = data;
				this.fillProjectsMap();
				this.updateFormData();
			}

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
		})
	}

	getLocationZoneList() {
		if (this.zoneList) {
			return;
		}
		this.locationZoneListService.getLocationZones().subscribe(data => {
			this.zoneList = Object.keys(data['loc']).map(function (key) {
				return data['loc'][key];
			}).reduce(
				function (ar1, ar2) {
					return ar1.concat(ar2);
				}, []
			);

		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
		})
	}

	updateFormData() {
		if(this.businessAccessDetails && this.businessAccessDetails.bu && this.businessAccessDetails.bu.length > 0){
			let business = '';
			if (this.updatedSearchOptions['business']) {
				business = this.updatedSearchOptions['business'];
			}
			this.formData['bu'] = business;
			this.onBusinessChange(this.updatedSearchOptions['project']);
		}

	}

	onSubmit(formData) {
		var options = {
			start_count: 0,
			zone: this.checkNullString(this.formData['zone']),
			project: this.checkNullString(this.formData['project']),
			env: this.formData['env'] ? parseInt(this.formData['env']) : '',
			business: this.checkNullString(this.formData['bu'])
		}
		this.searchOptions.emit(options);
	}

	checkNullString(str) {
		if (!str) {
			return '';
		}
		return str;
	}

	updateSearchOptions() {
		if (this.updatedSearchOptions) {
			this.formData['zone'] = this.checkNullString(this.updatedSearchOptions['zone']);
			this.formData['project'] = this.checkNullString(this.updatedSearchOptions['project']);
			this.formData['bu'] = this.checkNullString(this.updatedSearchOptions['business']);
			this.formData['env'] = this.checkEmptyString(this.updatedSearchOptions['env']);
		}
	}

	checkEmptyString(str) {
		if (str == '') {
			return null;
		}
		return str;
	}

	fillProjectsMap() {
		for (let i = 0; i < this.businessAccessDetails['bu'].length; i++) {
			this.projects[this.businessAccessDetails['bu'][i]['bu_name']] = this.businessAccessDetails['bu'][i]['project'];
		}
	}

	onBusinessChange(project) {
		this.formData['project'] = project ? project : '';
		this.filterCheck();
	}

	filterCheck() {

		/**
		 * This code is used for checking the interdependency of BU,zone and 
		 * env drop down on changing of project drop down
		 */

		if (this.formData['project'] == '') {
			this.formData['zone'] = '';
		}
		if (this.formData['bu'] == '') {
			this.formData['env'] = undefined;
			this.formData['zone'] = '';
		}
	}

	onZoneEnvChange() {

		/**
		 * This code is used for checking the interdependency of BU, project and env drop down
		 *  on changing of zone drop down.
		 */

		if (this.formData['zone'] != '') {

			this.formData['project'] = this.formData['project'] == '' ? this.projects[this.formData['bu']][0].project : this.formData['project'];
		}
		else if (this.formData['env']) {

			this.formData['bu'] = this.formData['bu'] == '' ? this.businessAccessDetails['bu'][0]['bu_name'] : this.formData['bu'];
		}

	}
}