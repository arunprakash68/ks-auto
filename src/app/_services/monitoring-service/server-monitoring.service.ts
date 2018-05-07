import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IMonitoringRequest } from './monitoring-request.interface';
import { APPCONFIG } from '../../config';

@Injectable()
export class ServerMonitoringService {

	constructor(private http: Http) {
	}

	getTotalRequests(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/requests?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let avgRequestTime = response.json();
				return avgRequestTime;
			});
	}

	getAvgRequestTime(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/avgreqtime?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let avgRequestTime = response.json();
				return avgRequestTime;
			});
	}

	getOriginBandwidth(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/originbandwidth?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let originBandwidth = response.json();
				return originBandwidth;
			});
	}

	getEdgeBandwidth(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/edgebandwidth?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let edgeBandwidth = response.json();
				return edgeBandwidth;
			});
	}

	getTotalBytes(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/totalbytes?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let totalbytes = response.json();
				return totalbytes;
			});
	}

	getPlatformDistribution(params: IMonitoringRequest) {

		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/pfdist?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let platformDistribution = response.json();
				return platformDistribution;
			});
	}

	getPercentErrors(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/errors?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let percentErrors = response.json();
				return percentErrors;
			});
	}

	getManifestAvgRequestTime(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/manifestavgreqtime?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let manifestAvgRequestTime = response.json();
				return manifestAvgRequestTime;
			});
	}

	getBandwidthOffloadTime(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/bandwidthoffload?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let bandwidthOffloadTime = response.json();
			return bandwidthOffloadTime;
		});
	}

	getCompedgeBandwidth(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/compedgebandwidth?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let compedgeBandwidth = response.json();
			return compedgeBandwidth;
		});
	}
	getAsnrequests(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/asnrequests?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let asnRequests = response.json();
			return asnRequests;
		});
	}
	getCityrequests(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/cityrequests?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let cityRequests = response.json();
			return cityRequests;
		});
	}
	getCountryrequests(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/countryrequests?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let countryRequests = response.json();
			return countryRequests;
		});
	}
	getAsnreqtime(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/asnreqtime?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let asnReqtime = response.json();
			return asnReqtime;
		});
	}
	getCityreqtime(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/cityreqtime?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let cityReqtime = response.json();
			return cityReqtime;
		});
	}
	getCountryreqtime(params: IMonitoringRequest) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/countryreqtime?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
		.map((response: Response) => {
			let countryReqtime = response.json();
			return countryReqtime;
		});
	}

	getCPCodes(params: any) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/cpcodes' + '?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let cpCodes = response.json();
				return cpCodes;
			});
	}

	getBusinesses() {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/cpcodes')
			.map((response: Response) => {
				let cpCodes = response.json();
				return cpCodes;
			});
	}

	getResponseStatuses() {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/responsestatuses')
			.map((response: Response) => {
				let statusCodes = response.json();
				return statusCodes;
			});
	}

	getLogsFilterKeys() {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/esfilterkeys')
			.map((response: Response) => {
				return response.json();
			});
	}

	getLogs(params: any) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/logs?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let logs = response.json();
				return logs;
			});
	}

	getCsvLogs(params: any) {
		console.log(params)
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/csvlogs?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let csvLogs = response.json();
				return csvLogs;
			});
	}


	getTopUrls(params: any) {
		return this.http.get(APPCONFIG['apiHost'] + '/api/cdn/servers/topurls?' + Object.keys(params).map(key => {
			return key + '=' + params[key];
		}).join('&'))
			.map((response: Response) => {
				let logs = response.json();
				return logs;
			});
	}



}