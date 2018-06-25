import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from './../services-utility.service';
import { GenericApiService } from './../generic-api.service';
import { APPCONFIG } from '../../config';

@Injectable()
export class CreateNewELBService extends GenericApiService {
	
	constructor(private servicesUtilityService: ServicesUtilityService, private injector: Injector){
		super(injector);
	}

	createNewELBVip(params){
		return this.makePostRequest({
			path: '/api/data-center/elb/create/elbvip',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	createNewELBPool(params){
		return this.makePostRequest({
			path: '/api/data-center/elb/create/elbpool',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	createNewELBMonitor(params){
		return this.makePostRequest({
			path: '/api/data-center/elb/create/elbmonitor',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	attachMonitorPool(params){
		return this.makePostRequest({
			path: '/api/data-center/elb/attach/mtop',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	attachPoolVip(params){
		return this.makePostRequest({
			path: '/api/data-center/elb/attach/ptov',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	attachSslVip(params){
		return this.makePostRequest({
			path : '/api/data-center/elb/attach/sslbind',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	sslRedirect(params){
		return this.makePostRequest({
			path : '/api/data-center/elb/sslredirect',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getDCZones(params) {
		return this.makeGetRequest({
			path: '/api/data-center/zones',
			params: params,
		});
	}
}
