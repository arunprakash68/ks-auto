import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from './services-utility.service';
import { GenericApiService } from './generic-api.service';
import { APPCONFIG } from '../config';

@Injectable()
export class CreateNewServerService extends GenericApiService {
	
	constructor(private servicesUtilityService: ServicesUtilityService, private injector: Injector){
		super(injector);
	}

	createNewServer(params){
		return this.makePostRequest({
			path: '/api/data-center/servers/new',
			params: params,
			headers: this.servicesUtilityService.getHeadersForServerCreation()
		});
	}

	getDCZones(params) {
		return this.makeGetRequest({
			path: '/api/data-center/zones',
			params: params,
		});
	}

	getOses(params) {
		return this.makeGetRequest({
			path: '/api/data-center/os',
			params: params,
		});
	}

	getTemplateImages(params) {
		return this.makeGetRequest({
			path: '/api/data-center/os/images',
			params: params,
		});
	}

	getVMTypes(params) {
		return this.makeGetRequest({
			path: '/api/data-center/os/vm-type',
			params: params,
		});
	}
}
