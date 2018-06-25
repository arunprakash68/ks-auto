import { Injectable, Injector } from '@angular/core';
import { GenericApiService } from './generic-api.service';
import { ServicesUtilityService } from './services-utility.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AccessService extends GenericApiService {

  constructor(private injector: Injector, private servicesUtilityService: ServicesUtilityService) {
    super(injector);
   }

   isSuperuser(){
    const userConfig = JSON.parse(localStorage.getItem('user'));
		return this.makePostRequest({
			path: '/api/access/user/issuperuser',
      headers: this.servicesUtilityService.getDefaultHeaders()
		});
  }
  
  fetchAll(a: any){
		return this.makePostRequest({
      path: '/api/access/user/all',
      params: {lowercap: a.lowercap, uppercap: a.uppercap},
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  fetchUserAll(a: any){
		return this.makePostRequest({
      path: '/api/access/user/userall',
      params: {query: a.query},
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  fetchUser(b: any){
		return this.makePostRequest({
      path: '/api/access/user/fetchuser',
      params: {id: b.id?b.id:undefined, email: b.email?b.email:undefined},
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  fetchAccess(b: any){
		return this.makePostRequest({
      path: '/api/access/user/fetchaccess',
      params: {aid: b.aid},
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  
  fetchAccessbyuser(b: any){
		return this.makePostRequest({
      path: '/api/access/user/fetchaccessbyuser',
      params: {id: b.id, business: b.business},
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  updateUser(b: any){
		return this.makePostRequest({
      path: '/api/access/user/updateuser',
      params: {
        id: b.id,
        name: b.name,
        email: b.email,
        super_user: b.super_user
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  updateAccess(b: any){
		return this.makePostRequest({
      path: '/api/access/user/updateaccess',
      params: {
        id: b.aid,
        // approver: b.approver,
        // project: b.project,
        // costcenter: b.costcenter,
        access_type: b.access_type
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  addUser(b: any){
		return this.makePostRequest({
      path: '/api/access/user/adduser',
      params: {
        name: b.fullname,
        email: b.email,
        super_user: b.superuser
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  addAccess(b: any){
		return this.makePostRequest({
      path: '/api/access/user/addaccess',
      params: {
        id: b.id,
        approver: b.approver,
        project: b.project,
        costcenter: b.costcenter,
        access_type: b.access_type
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  deleteUser(b: any){
		return this.makePostRequest({
      path: '/api/access/user/deleteuser',
      params: {
        email: b.email
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
  }
  deleteAccess(b: any){
		return this.makePostRequest({
      path: '/api/access/user/deleteaccess',
      params: {
        id: b.id
      },
      headers: this.servicesUtilityService.getDefaultHeaders()
    });
	}
}
