import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';

export interface IClusterData {
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
export class ClusterListService {
	
	constructor(private http: Http){}

	getMyClusters(params?): Observable<any> {
		let userConfig = JSON.parse(localStorage.getItem('user'));
		params['token'] = userConfig['tokenid'];
		params['email'] = userConfig['userprincipalname'];
		return this.http.post(APPCONFIG['apiHost'] + '/api/data-center/clusters', params)
		.map(this.extractClusterData)
	}

	extractClusterData(response: Response): any {
		return response.json();
	}

}
