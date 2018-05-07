import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BusinessAccessDetailsService } from '../../../../_services/business-access-details.service';
import { LocationZoneListService } from '../../../../_services/location-zone-list.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { BuProjectComponent } from '../../../../shared/bu-project/bu-project.component';



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
	@ViewChild('buProject') container:BuProjectComponent;


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
		this.getLocationZoneList();
	}

	// bu project component update
	getBuProData(data){
		this.businessAccessDetails = data.businessAccessDetails;
		this.projects = data.projects
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
			this.container.formData = this.formData;
		}
	}

	checkEmptyString(str) {
		if (str == '') {
			return null;
		}
		return str;
	}

	onBusinessChange(data) {
		this.formData['project'] = data ? data.project : '';
		this.formData['bu'] = data ? data.bu : '';
		this.filterCheck();
	}

	onProjectChange(data){
		this.formData['project'] = data ? data.project : '';
		this.formData['bu'] = data ? data.bu : '';
		this.filterCheck();
		// do nothing not required here
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

	onZoneEnvChange(buProject) {

		/**
		 * This code is used for checking the interdependency of BU, project and env drop down
		 *  on changing of zone drop down.
		 */

		if (this.formData['zone'] != '') {
			
			this.formData['bu'] = this.formData['bu'] == '' ? this.businessAccessDetails['bu'][0]['bu_name'] : this.formData['bu'];
			this.formData['project'] = this.formData['project'] == '' ? this.projects[this.formData['bu']][0].project : this.formData['project'];
			this.container.formData['project'] = this.formData['project'];
			this.container.formData['bu'] = this.formData['bu'];
		}
		else if (this.formData['env']) {

			this.formData['bu'] = this.formData['bu'] == '' ? this.businessAccessDetails['bu'][0]['bu_name'] : this.formData['bu'];
			this.container.formData['bu'] = this.formData['bu'];
		}
	}
}