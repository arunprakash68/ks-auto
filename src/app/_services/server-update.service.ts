import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { ServicesUtilityService } from './services-utility.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';

@Injectable()
export class ServerUpdateService extends GenericApiService {
	
	constructor(private injector: Injector,
		private servicesUtilityService: ServicesUtilityService){
		super(injector);
	}

	deleteServer(params){
		return this.makePostRequest({
			path: '/api/data-center/servers/delete',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	updateServerData(params){
		
		return this.makePostRequest({
			path: '/api/data-center/servers/update',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

}
