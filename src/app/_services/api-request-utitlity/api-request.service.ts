import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiRequest } from './api-request.interface';
import { ServicesUtilityService } from '../services-utility.service';
import { APPCONFIG } from '../../config';

@Injectable()
export class ApiRequestService {
	private options: ApiRequest;
	// private http: Http;
	// private servicesUtilityService: ServicesUtilityService;

	constructor(private servicesUtilityService: ServicesUtilityService,
		private http: Http) {
	}

	// constructor(private injector: Injector) {
	// 	this.http = this.injector.get(Http);
	// 	this.servicesUtilityService = this.injector.get(ServicesUtilityService);
	// }

	resolveRequest(options: ApiRequest) {
		this.options = options;
		switch(this.options.type) {
			case 'GET':
			return this.makeGetRequest();
			case 'POST':
			return this.makePostRequest();
		}
		throw new Error('Request Type Unknown');
	}

	private makeGetRequest() {
		const options = new RequestOptions({ headers: this.options.headers, search: this.options.params });
		// let paramString = null;
		// if(this.options.params) {
		// 	paramString = this.servicesUtilityService.getParamsString(this.options.params);
		// }
		// return this.http.get(this.options.url + this.options.path + '?' + 
		// 	this.servicesUtilityService.getParamsString(this.options.params), options)
		// .map((response: Response) => {
		// 	return response.json();
		// });

		return this.http.get(this.options.url + this.options.path, options)
		.map((response: Response) => {
			return response.json();
		});
	}

	private makePostRequest() {
		const options = new RequestOptions({ headers: this.options.headers })
		return this.http.post(this.options.url + this.options.path, this.options.params, options)
		.map((response: Response) => {
			return response.json();
		});
	}	

}