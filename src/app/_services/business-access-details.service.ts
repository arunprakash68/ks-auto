import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { ServicesUtilityService } from './services-utility.service';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';

@Injectable()
export class BusinessAccessDetailsService extends GenericApiService {

	constructor(private injector: Injector,
		private servicesUtilityService: ServicesUtilityService){
		super(injector);
	}

	getBusinessAccessDetails() {
		
		return this.makeGetRequest({
			path: '/api/business-access-details',
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

}
