import { Injectable, Injector } from '@angular/core';
import { ServicesUtilityService } from './services-utility.service';
import { GenericApiService } from './generic-api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APPCONFIG } from '../config';


@Injectable()
export class LocationZoneListService extends GenericApiService {

    constructor(private injector: Injector,
    private servicesUtilityService : ServicesUtilityService){
		super(injector);
	}

	getLocationZones() {

		return this.makeGetRequest({
            path: '/api/data-center/locations',
            headers: this.servicesUtilityService.getDefaultHeaders()
		});
	}

}
