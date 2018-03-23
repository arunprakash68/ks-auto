import { Injectable, Injector } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService } from './services-utility.service';
import { GenericApiService } from './generic-api.service';
import { APPCONFIG } from '../config';

@Injectable()
export class BillingService extends GenericApiService  {

	constructor(private injector: Injector, 
		private http: Http,
		private servicesUtilityService: ServicesUtilityService) {
		super(injector);
	}

	getBillingDetails(params) {
		return this.makeGetRequest({
			path: '/api/cost/getprojectwisecost',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getAssetBillingDetails(params) {
		return this.makeGetRequest({
			path: '/api/cost/getzoneassetlist',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getDCZones() {
		return this.makeGetRequest({
			path: '/api/cost/getdatacenterzone',
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getDITypes() {
		return this.makeGetRequest({
			path: '/api/cost/getstoragelist',
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getAssetModels() {
		return this.makeGetRequest({
			path: '/api/cost/getassetmodel',
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

	getAssetModelTypes() {
		return this.makeGetRequest({
			path: '/api/cost/getassetmodeltype',
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}	

	updateAssetData(params) {
		return this.makePostRequest({
			path: '/api/cost/updateassetdetails',
			headers: this.servicesUtilityService.getDefaultHeaders(),
			params: params
		});
	}	



}