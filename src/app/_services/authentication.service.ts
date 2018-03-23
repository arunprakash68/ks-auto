import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';

@Injectable()
export class AuthenticationService extends GenericApiService {

	constructor(private injector: Injector){
		super(injector);
	}

	login(email: string, password: string){
		
		return this.makePostRequest({
			path: '/login',
			params: {email: email, password: password}
		});
	}

	logout(){
		localStorage.removeItem('currentUser');
	}
}
