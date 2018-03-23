import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from './services-utility.service';
import { APPCONFIG } from '../config';

@Injectable()
export class ServerAlertsService extends GenericApiService {
	
	constructor(private injector: Injector,
		private servicesUtilityService: ServicesUtilityService){
		super(injector);
	}

	getServerAlerts(params){

		return this.makeGetRequest({
			path: '/api/data-center/servers/alerts',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		})
	}



}
