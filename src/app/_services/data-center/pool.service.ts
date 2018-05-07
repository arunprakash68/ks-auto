import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from './../services-utility.service';
import { GenericApiService } from './../generic-api.service';
import { APPCONFIG } from '../../config';

@Injectable()
export class PoolService extends GenericApiService {
	
	constructor(private servicesUtilityService: ServicesUtilityService, private injector: Injector){
		super(injector);
	}

	getPoolSummary(params){
		return this.makeGetRequest({
			path: '/api/data-center/pool/sgsummary',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getPoolMembers(params){
		return this.makeGetRequest({
			path: '/api/data-center/pool/sgmembers',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	addPoolMembers(params){
		return this.makePostRequest({
			path: '/api/data-center/pool/sgmembers',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	actionPoolMembers(params){
		return this.makePostRequest({
			path: '/api/data-center/pool/serviceaction',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	deletePoolMembers(params){
		return this.makeDeleteRequest({
			path: '/api/data-center/pool/sgmembers',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}
}
