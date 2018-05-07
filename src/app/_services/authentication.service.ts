import { Injectable, Injector } from '@angular/core';
// import { Http, Headers, Response } from '@angular/http';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthenticationService extends GenericApiService {

	constructor(private injector: Injector){
		super(injector);
	}

	login(email: string, password: string){
		let simpledata = {
			email, 
			password
		}
		let encrypted = CryptoJS.AES.encrypt(JSON.stringify(simpledata), 'momuoyevol');
		
		
		var encrypteData=encrypted.toString(CryptoJS.enc.utf8);
		// console.log('encrypteData',typeof encrypteData);
		if(!localStorage.getItem('x'))
		{
			localStorage.setItem("x", encrypteData);
		}

		return this.makePostRequest({
			path: '/login',
			// params: {email: email, password: enc}
			params: { data: encrypteData }
		});
	}

	logout(){

		localStorage.removeItem('user');
		localStorage.removeItem('x');
	}

	loggingout(token: string){
		return this.makePostRequest({
			path: '/logout',
			params: {token: token}
		});
	}
}
