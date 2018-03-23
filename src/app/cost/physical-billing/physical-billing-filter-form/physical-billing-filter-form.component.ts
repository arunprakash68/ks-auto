import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DataCenterListService } from '../../../_services/data-center-list.service';
import { BillingService } from '../../../_services/billing.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
	selector: 'physical-billing-filter-form',
	styles: [],
	providers: [DataCenterListService, BillingService, ErrorHandlerService],
	templateUrl: './physical-billing-filter-form.component.html'
})

export class PhysicalBillingFilterFormComponent {
  diTypes: any;
  dataCenters: any[];
  dcZones: any;
  assetModels: any;
  assetModelTypes: any;
  formData: any;
  @Input() isCollapsed: boolean;
  @Input() updatedSearchOptions: any;
  @Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output() triggerFilterCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();

  
  constructor(private dataCenterListService: DataCenterListService, 
    private billingService: BillingService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {
    this.formData = {};
    this.dcZones = {};
  }

  ngOnChanges(){
    if (this.isCollapsed) {
      this.openBillingFilter();
    }
    // this.updateSearchOptions();
  }

  triggerCollapse() {
    this.triggerFilterCollapse.emit(true);
  }

  openBillingFilter() {
    if(this.dataCenters && this.dcZones && this.diTypes) return;
    this.getDITypes();
    this.fetchModelTypes();
    let dcAPIObservable = this.dataCenterListService.getDataCenters();
    let dcZonesAPIObservable = this.billingService.getDCZones();

    forkJoin(dcAPIObservable, dcZonesAPIObservable).subscribe(results => {
      if(results[0]) {
        this.dataCenters = results[0];  
        this.formData['dc'] = '';
      }
      if(results[1] && results[1] != 0) {
        for(let i = 0; i < results[1].result.length; i++) {
          if(!this.dcZones[results[1].result[i]['DC_ID']]) {
            this.dcZones[results[1].result[i]['DC_ID']] = [];
          }
          this.dcZones[results[1].result[i]['DC_ID']].push(results[1].result[i]);
        }
        this.formData['dcZone'] = '';
      }
    }, errors => {

    })
    // this.getDatacenters();
    // this.getBusinessAccessDetails();
  }

  fetchModelTypes() {
    let modelsAPIObservable = this.billingService.getAssetModels();
    let modelTypesAPIObservable = this.billingService.getAssetModelTypes();
    forkJoin([modelsAPIObservable, modelTypesAPIObservable]).subscribe(results => {
      
      if(results[0] && results[0]['status'] != 0) {
        this.assetModels = results[0]['result'];
        this.formData['ASSET_TYPE_ID'] = '';
      }
      if(results[1] && results[1]['status'] != 0){
        this.assetModelTypes = results[1]['result'];
        this.formData['MODEL'] = '';
      }
    }, error => {
      if (!this.errorHandlerService.validateAuthentication(error)) {
        this.router.navigate(['/login']);
      }
    });
  }

  getDITypes() {
    this.billingService.getDITypes().subscribe(data => {
      if(data && data['status'] != 0){
        this.diTypes = data;
        this.formData['diType'] = '';
      }
    }, error => {

    })
  }

  // getDatacenters() {
  //   if(this.dataCenters) {
  //     return;
  //   }
  //   this.dataCenterListService.getDataCenters().subscribe(data => {
  //     console.log(data);
  //     this.dataCenters = data;
  //   });
  // }

  // updateFormData() {
  //   if(this.businessAccessDetails && this.businessAccessDetails.bu && this.businessAccessDetails.bu.length > 0) {
  //     // this.formData['bu'] = this.businessAccessDetails.bu[0]['bu_name'];
  //     let business = '';
  //     if(this.updatedSearchOptions['business']){
  //       business = this.updatedSearchOptions['business'];
  //     }
  //     this.formData['bu'] = business;
  //     this.onDCChange(this.updatedSearchOptions['project']);
  //   }

  // }

  onSubmit() {
    let options = {
      dc: this.checkNullString(this.formData['dc']),
      zone: this.checkNullString(this.formData['dcZone']),
      di_type: this.checkNullString(this.formData['diType']),
      model: this.checkNullString(this.formData['MODEL']),
      model_type: this.checkNullString(this.formData['ASSET_TYPE_ID']),
    }
    this.searchOptions.emit(options);
    this.triggerCollapse();
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

  
  onDCChange() {
    this.formData['dcZone'] = '';
  }

}