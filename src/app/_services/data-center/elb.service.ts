import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from '../services-utility.service';
import { GenericApiService } from '../generic-api.service';

@Injectable()
export class ELBService extends GenericApiService {
	
	constructor(private servicesUtilityService: ServicesUtilityService, private injector: Injector){
		super(injector);
	}

	getELBList(params) {
		return this.makeGetRequest({
			path: '/api/data-center/vipsummary',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getELBStats(params) {
		return this.makeGetRequest({
			path: '/api/data-center/vipstats',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getLBMethods(params) {
		return this.makeGetRequest({
			path: '/api/data-center/lbalgo',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getSSLCertificate(params) {
		return this.makeGetRequest({
			path: '/api/data-center/sslcert',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getSnatPools(params) {
		return this.makeGetRequest({
			path: '/api/data-center/snatpools',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}
}
