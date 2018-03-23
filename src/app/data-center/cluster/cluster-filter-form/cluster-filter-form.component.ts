import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataCenterListService } from '../../../_services/data-center-list.service';
import { BusinessAccessDetailsService } from '../../../_services/business-access-details.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
	selector: 'cluster-filter-search',
	styles: [],
	providers: [DataCenterListService, BusinessAccessDetailsService, ErrorHandlerService],
	templateUrl: './cluster-filter-form.component.html'
})

export class ClusterFilterFormComponent {
  businessAccessDetails: any;
  dataCenters: any[];
  @Input() isCollapsed: boolean;
  @Output() searchOptions: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private dataCenterListService: DataCenterListService, 
    private businessAccessDetailsService: BusinessAccessDetailsService, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {
  }

  ngOnChanges(){
    if (this.isCollapsed) {
      this.openClusterFilter();
    }
  }

  openClusterFilter() {
    this.dataCenterListService.getDataCenters().subscribe(data => {
      this.dataCenters = data;
    });

    this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
      
      this.businessAccessDetails = data;
    }, error => {
      if (!this.errorHandlerService.validateAuthentication(error)) {
        this.router.navigate(['/login']);
      }    
    })

  }

  onSubmit(formData){
    var options = {
      start_count: 0,
      search_value: formData['search-text'],
      project: formData['select-project'],
      env: formData['environment'],
      status: formData['health'],
      location: formData['select-location'],
      business: formData['select-business'],
    }
    this.searchOptions.next(options);
    // this.getMyServers(options);
  }
}