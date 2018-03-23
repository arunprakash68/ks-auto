import { Injectable } from '@angular/core';
import { APPCONFIG } from '../config';
import { Headers } from '@angular/http';

@Injectable()
export class ServicesUtilityService {

	getDefaultHeaders(): Headers {
		const userConfig = JSON.parse(localStorage.getItem('user'));
		let headers = new Headers();
		headers.append('X-Email', userConfig['userprincipalname']);
		headers.append('X-Token', userConfig['tokenid']);
		headers.append('Content-Type', 'application/json');
		return headers;
	}

	getHeadersForServerCreation() {
		const userConfig = JSON.parse(localStorage.getItem('user'));
		let headers = new Headers();
		headers.append('X-Email', userConfig['userprincipalname']);
		headers.append('X-Token', userConfig['tokenid']);
		headers.append('X-Department', userConfig['department']);
		// headers.append('Content-Type', 'application/json');
		return headers;	
	}

	getParamsString(paramsObject): String {
		return Object.keys(paramsObject).map(key => {
			return key + '=' + encodeURIComponent(paramsObject[key]);
		}).join('&');
	}

	getUser() {
		return JSON.parse(localStorage.getItem('user'));
	}

	getServerEnvironmentMapping() {
		const envDisplay = {
			Production: 'prod',
			PreProd: 'pre prod',
			Staging: 'staging',
			QA: 'qa',
			DR: 'dr'
		}

		return envDisplay;
	}
}
