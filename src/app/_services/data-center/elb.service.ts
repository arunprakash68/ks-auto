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

	getVolumeList(params) {
		return this.makeGetRequest({
			path: '/api/data-center/volume/fetchall',
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

	getLBEvents(params) {
		return this.makeGetRequest({
			path: '/api/data-center/lbevents',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	deleteELB(params){
		return this.makeDeleteRequest({
			path: '/api/data-center/elb/delete/hostvip',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	updateELB(params){
		return this.makePutRequest({
			path: '/api/data-center/elb/edit/vip',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}
}
