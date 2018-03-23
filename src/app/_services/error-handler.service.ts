import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ErrorHandlerService {

	
	// validateAuthentication(response){
	// 	if (response && (response[status] == 0 || response['message'] == 'Invalid Token')) {
	// 		return false;
	// 	}
	// 	return true;
	// }

	validateAuthentication(response){
		console.log(response);
		if (response && response['status'] && (response['status'].toString() == 401 
			|| response['status'].toString() == 403 
			|| response['status'].toString() == 406 
			|| response['message'] == 'Invalid Token')) {
			return false;
		}
		return true;
	}



}
