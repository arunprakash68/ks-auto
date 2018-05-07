import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataMapService {
    lbTagMap :  any;
    statusIconMap :  any;
	envMap :  any;
	locZoneMap :  any;

    constructor(){
		this.lbTagMap = {
			'http' : 'application',
			'https' : 'application',
			'ssl' : 'application',
			'tcp' : 'network',
        }
        this.statusIconMap = {
			'up': 'circle green',
			'down': 'circle red',
			'available': 'circle green',
			'offline': 'circle red',
			'out of service': 'exclamation-triangle',
            'unknown': 'exclamation-triangle',
            'partial-up' : 'circle yellow',
			'partial-down' : 'circle dark-yellow',
        }
        this.envMap = {
			1 : 'prod',
			2 : 'preprod',
			3 : 'staging',
			4 : 'qa',
			5 : 'dr'
		}
		this.locZoneMap = {
			'til-chn-1a' : 'Chennai',
			'til-chn-2a' : 'Chennai',
			'til-mum-1a' : 'Mumbai',
			'til-mum-2a' : 'Mumbai',
		}
	}

	getMap(value,obj) {
        if(value){
            let val = value.toString().toLowerCase();
            return this[obj][val]
        } 
        else
            return ''
    }
}