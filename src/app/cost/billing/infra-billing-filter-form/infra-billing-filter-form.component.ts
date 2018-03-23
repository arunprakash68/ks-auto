import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataCenterListService } from '../../../_services/data-center-list.service';
import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
	selector: 'infra-billing-filter-form',
	styles: [],
	providers: [DataCenterListService, BusinessAccessDetailsService, ErrorHandlerService],
	templateUrl: './infra-billing-filter-form.component.html'
})

export class InfraBillingFilterFormComponent {
  businessAccessDetails: any;
  dataCenters: any[];
  projects: any;
  formData: any;
  @Input() isCollapsed: boolean;
  @Input() updatedSearchOptions: any;
  @Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output() triggerFilterCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();

  
  constructor(private dataCenterListService: DataCenterListService, 
    private businessAccessDetailsService: BusinessAccessDetailsService, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {
    this.formData = {};
    this.projects = {};
  }

  ngOnChanges(){
    if (this.isCollapsed) {
      this.openBillingFilter();
    }
    this.updateSearchOptions();
  }

  triggerCollapse() {
    this.triggerFilterCollapse.emit(true);
  }

  openBillingFilter() {
    this.getDatacenters();
    this.getBusinessAccessDetails();
  }

  getDatacenters() {
    if(this.dataCenters) {
      return;
    }
    this.dataCenterListService.getDataCenters().subscribe(data => {
      console.log(data);
      this.dataCenters = data;
    });
  }

  getBusinessAccessDetails() {
    if(this.businessAccessDetails) {
      return;
    }
    this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
      
      console.log(data);
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

  updateFormData() {
    if(this.businessAccessDetails && this.businessAccessDetails.bu && this.businessAccessDetails.bu.length > 0) {
      // this.formData['bu'] = this.businessAccessDetails.bu[0]['bu_name'];
      let business = '';
      if(this.updatedSearchOptions['business']){
        business = this.updatedSearchOptions['business'];
      }
      this.formData['bu'] = business;
      this.onBusinessChange(this.updatedSearchOptions['project']);
    }

  }

  onSubmit(formData){
    // let options = {
    //   costtype: 'bu',
    //   month: currentDate.getUTCMonth() + 1,
    //   year: currentDate.getUTCFullYear(),
    //   bu_value: ''
    // };
    let options = {
      project_value: this.checkNullString(this.formData['project']),
      env: this.checkNullString(this.formData['env']),
      status: this.checkNullString(this.formData['health']),
      location: this.checkNullString(this.formData['location']),
      bu_value: this.checkNullString(this.formData['bu']),
      servertype: this.checkNullString(this.formData['servertype'])
    }
    this.searchOptions.emit(options);
  }

  checkNullString(str) {
    if(!str) {
      return '';
    }
    return str;
  }

  updateSearchOptions() {
    // if(this.updatedSearchOptions) {
    //   this.formData['searchtext'] = this.updatedSearchOptions['search_value'];
    //   this.formData['project'] = this.checkNullString(this.updatedSearchOptions['project']);
    //   this.formData['bu'] = this.checkNullString(this.updatedSearchOptions['business']);
    //   this.formData['env'] = this.checkEmptyString(this.updatedSearchOptions['env']);
    //   this.formData['health'] = this.checkEmptyString(this.updatedSearchOptions['status']);
    //   this.formData['location'] = this.checkEmptyString(this.updatedSearchOptions['location']);
    //   this.formData['servertype'] = this.checkEmptyString(this.updatedSearchOptions['servertype']);
    // }
  }

  checkEmptyString(str) {
    if(str == '') {
      return null;
    }
    return str;
  }

  fillProjectsMap() {
    for(let i = 0; i < this.businessAccessDetails['bu'].length; i++) {
      this.projects[this.businessAccessDetails['bu'][i]['bu_name']] = this.businessAccessDetails['bu'][i]['project'];
    }
  }

  onBusinessChange(project?) {

    // if(this.projects && this.projects[this.formData['bu']].length > 0) {
      // this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
      this.formData['project'] = project ? project : '';
      // }

    }

  }