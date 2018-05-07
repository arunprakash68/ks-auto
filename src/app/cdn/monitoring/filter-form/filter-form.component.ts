import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ServerMonitoringService } from '../../../_services/monitoring-service/server-monitoring.service';
import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
	selector: 'performance-filter-form',
	styles: [],
	providers: [BusinessAccessDetailsService, ErrorHandlerService],
	templateUrl: './filter-form.component.html'
})

export class PerformanceFilterFormComponent {
  businessAccessDetails: any;
  projects: any;
  cpCodes: any;
  loading: any;
  loadingError: any;
  formData: any;
  formFilters: any;
  viewGraphsErrorMessage: string;
  serviceTypeDisabled: boolean;
  cpCodeDisabled: boolean;
  datepickerConfig: any;
  myFromDateDisplay: string;
  myToDateDisplay: string;
  @Input() isCollapsed: boolean;
  @Input() updatedSearchOptions: any;
  @Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output() showGraphs: EventEmitter<any> = new EventEmitter<any>();
  @Output() triggerFilterCollapse: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() businessAccessDetailsOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() businessFiltersOut: EventEmitter<any> = new EventEmitter<any>();

  
  constructor(private businessAccessDetailsService: BusinessAccessDetailsService, 
    private serverMonitoringService: ServerMonitoringService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {

    this.formData = {};
    this.projects = {};
    this.datepickerConfig = {
      showFromPicker: false,
      showToPicker: false,
      showDate: true,
      showTime: true
    };
    this.businessAccessDetails = [];
    this.serviceTypeDisabled = true;
    this.cpCodeDisabled = true;
    this.formData.myFromDate = new Date();
    this.formData.myFromDate.setDate(this.formData.myFromDate.getDate() - 1);
    this.formData.myToDate = new Date();
    this.updateFromDateDisplay();
    this.updateToDateDisplay();
    this.formData.cpCode = '';
    // this.formData.myFromDate.setHours(0,0,0,0);
    this.loading = {
      business: true,
    };
    this.loadingError = {
      business: false
    };
  }

  ngOnChanges() {
    if(this.businessAccessDetails.length == 0) {
      this.getMyBusinesses();
    }
  }

  triggerCollapse() {
    this.triggerFilterCollapse.emit(true);
  }

  
  getMyBusinesses() {
   this.showGraphs.emit({
      loading: true,
      loadingError: false,
      loadingSuccess: false
    });
    this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {

      this.showGraphs.emit({
        loading: false,
        loadingError: false,
        loadingSuccess: false
      });
      if (data && data['status'] != 0) {
        this.businessAccessDetails = data['bu'].map(function(obj){
          return obj.bu_name;
        });
        this.businessAccessDetailsOut.emit(this.businessAccessDetails);
        this.formData.business = this.businessAccessDetails[0];
        this.onBusinessSelected();
        this.onSubmit(true);
        this.showGraphs.emit({
          loading: false,
          loadingError: false,
          loadingSuccess: true
        });
      }
      
    }, error => {
      if (!this.errorHandlerService.validateAuthentication(error)) {
        this.router.navigate(['/login']);
      }
      this.showGraphs.emit({
        loading: false,
        loadingError: true,
        loadingSuccess: false
      });
      this.viewGraphsErrorMessage = 'Something went wrong. Please try again';
    })

    // this.serverMonitoringService.getBusinesses().subscribe(data => {
      
    //   this.showGraphs.emit({
    //     loading: false,
    //     loadingError: false,
    //     loadingSuccess: false
    //   });
      
      
    //   if (data && data['items'] && data['items'].length > 0) {
    //     for(let i = 0; i < data['items'].length; i++) {
    //       if(this.businessAccessDetails.indexOf(data['items'][i]['business']) < 0) {
    //         this.businessAccessDetails.push(data['items'][i]['business']); 
    //       }
    //     }
    //     this.businessAccessDetailsOut.emit(this.businessAccessDetails);
    //     this.formData.business = this.businessAccessDetails[0];
    //     this.onBusinessSelected();
    //     this.onSubmit(true);
    //     this.showGraphs.emit({
    //       loading: false,
    //       loadingError: false,
    //       loadingSuccess: true
    //     });
    //   } else {
    //     this.showGraphs.emit({
    //       loading: false,
    //       loadingError: true,
    //       loadingSuccess: false
    //     });
    //     this.viewGraphsErrorMessage = 'Something went wrong. Please try again';
    //   }
    // }, error => {
    //   if (!this.errorHandlerService.validateAuthentication(error)) {
    //     this.router.navigate(['/login']);
    //   }
    //   this.showGraphs.emit({
    //     loading: false,
    //     loadingError: true,
    //     loadingSuccess: false
    //   });
    //   this.viewGraphsErrorMessage = 'Something went wrong. Please try again';
    // }) 
  }

  getCPCodes(options) {
    this.serverMonitoringService.getCPCodes(options).subscribe(data => {
      if (data) {
        if (!data['items']) {
          return;
        }
        let items = data['items']; 
        this.formFilters = {};
        this.formFilters['serviceTypes'] = [];
        for(let i = 0; i < items.length; i++) {
          let item = items[i];
          if(!this.formFilters[item['service_type']]) {
            this.formFilters[item['service_type']]  = [];
            this.formFilters['serviceTypes'].push([item['service_type']]);  
          }
          this.formFilters[item['service_type']].push({
            cp_code: item['cp_code'],
            cp_code_name: item['cp_code_name']
          });  
        }
        this.businessFiltersOut.emit(this.formFilters);
      }
    }, error => {
      this.loading['percentErrors'] = false;
      this.loadingError['percentErrors'] = true;
    });  
  }

  onSubmit(toBeSubmitted) {
    if(!toBeSubmitted) return;
    this.viewGraphsErrorMessage = '';
    if(this.formData.myFromDate > this.formData.myToDate) {
      this.viewGraphsErrorMessage = '"From Date" cannot be greater than "To Date"';
      return;
    }
    let timeDiff = Math.abs(this.formData.myToDate.getTime() - this.formData.myFromDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // if(diffDays > 2) {
    //   this.viewGraphsErrorMessage = 'Please select a date range not greater than 2 days.';
    //   return;
    // }
    let fromDate = Date.parse(this.formData.myFromDate.toString());
    let toDate = Date.parse(this.formData.myToDate.toString());
    let options = {
      start_time: Math.ceil(fromDate / 1000),
      end_time: Math.ceil(toDate / 1000),
      business: this.formData['business']
    };
    if(this.formData.serviceType != ''){
      options['service_type'] = this.formData.serviceType;
    }
    if(this.formData.cpCode != '') {
      options['cp_code'] = this.formData.cpCode;
    }
    this.searchOptions.emit(options);
  }

  onFromDateChange(val: Date) {
    this.formData.myFromDate = val;
    this.updateFromDateDisplay();
  }

  onToDateChange(val: Date) {
    this.formData.myToDate = val;
    this.updateToDateDisplay();
  }

  updateFromDateDisplay() {
    this.myFromDateDisplay = this.formData.myFromDate.toString().split(' GMT')[0];//.toUTCString().split(' GMT')[0];
  }

  updateToDateDisplay() {
    this.myToDateDisplay = this.formData.myToDate.toString().split(' GMT')[0];//.toUTCString().split(' GMT')[0];
  }    

  onToggleFromPicker() {
    if (this.datepickerConfig.showFromPicker === false) {
      this.datepickerConfig.showFromPicker = true;
    }
  }

  onToggleToPicker() {
    if (this.datepickerConfig.showToPicker === false) {
      this.datepickerConfig.showToPicker = true;
    }
  }

  

  onBusinessSelected() {
    this.serviceTypeDisabled = false;
    this.formData.serviceType = '';
    this.formData.cpCode = '';
    this.cpCodeDisabled = true;
    this.getCPCodes({
      business: this.formData.business
    });
  }

  onServiceTypeSelected() {
    this.formData.cpCode = '';
    this.cpCodeDisabled = false;
    this.cpCodes = this.formFilters[this.formData.serviceType];
  }

}