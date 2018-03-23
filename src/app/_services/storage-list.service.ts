import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ServicesUtilityService  } from './services-utility.service';
import { APPCONFIG } from '../config';

export interface IStorageData {
	os: string;
	osImage: string,
	vmTypeImage: string,
	monitorStatus: string,
	monitoringValue: string,
	project: string,
	vmType: string,
	hostName: string;
	ip: string;
	cpu: string;
	memory: string;
	location: string;
	status: string;
}

@Injectable()
export class StorageListService extends GenericApiService {
	
	constructor(private injector: Injector,
		private servicesUtilityService: ServicesUtilityService){
		super(injector);
	}

	getMyStorages(params): Observable<any> {
		
		return this.makeGetRequest({
			path: '/api/data-center/storages',
			params: params,
			headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

}
