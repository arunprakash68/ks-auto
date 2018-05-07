import { Injector } from '@angular/core';
import { ApiRequestService } from './api-request-utitlity/api-request.service';
import { ApiRequest } from './api-request-utitlity/api-request.interface';
import { APPCONFIG } from '../config';
import { Router, NavigationEnd } from '@angular/router';

export class GenericApiService {
	apiRequestService: ApiRequestService;
	
	constructor(injector: Injector) {
		this.apiRequestService = injector.get(ApiRequestService);
	}

	makeGetRequest(apiRequest: any) {
		apiRequest['type'] = 'GET';
		apiRequest['url'] = APPCONFIG['apiHost'];
		return this.apiRequestService.resolveRequest(apiRequest);
	}

	makePostRequest(apiRequest: any) {
		apiRequest['type'] = 'POST';
		apiRequest['url'] = APPCONFIG['apiHost'];
		return this.apiRequestService.resolveRequest(apiRequest);		
	}

	makeDeleteRequest(apiRequest: any) {
		apiRequest['type'] = 'DELETE';
		apiRequest['url'] = APPCONFIG['apiHost'];
		return this.apiRequestService.resolveRequest(apiRequest);		
	}

	makePutRequest(apiRequest: any) {
		apiRequest['type'] = 'PUT';
		apiRequest['url'] = APPCONFIG['apiHost'];
		return this.apiRequestService.resolveRequest(apiRequest);		
	}

}