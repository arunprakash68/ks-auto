import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'create-monitor',
	styles: [],
	providers: [ServicesUtilityService,ErrorHandlerService],
	templateUrl: './create-monitor.component.html'
})

export class CreateMonitorComponent implements OnInit {
	test: any;
	monitorname: any;

	@Input() formData: any;
	@Output() sendFormData: EventEmitter<any> = new EventEmitter<any>();

	constructor(private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
        private router: Router,
        public viewContainerRef: ViewContainerRef){

	}

	ngOnInit() {
	}


	updateFormData(){
		this.sendFormData.emit(this.formData);
	}

}