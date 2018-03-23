import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { ServicesUtilityService } from './services-utility.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';

@Injectable()
export class ServerStatsService extends GenericApiService {
	userConfig: any;

	constructor(private injector: Injector,
		private servicesUtilityService: ServicesUtilityService){
		super(injector);
	}

	getServerStats(params){
		
		return this.makeGetRequest({
			path: '/api/data-center/servers/stats',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

}
