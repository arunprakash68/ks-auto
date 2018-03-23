import { Component, OnInit,Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


import { ELBService } from '../../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'create-vip',
	styles: [],
	providers: [ServicesUtilityService,ErrorHandlerService,ELBService],
	templateUrl: './create-vip.component.html'
})

export class CreateVipComponent implements OnInit {
	loading: any;
	loadingError: any;
	schemeList: any;
	monitoringEnvList: any;
	objectKeys: any;
	sslCertList : any;
	lbProtocol : any;
	profiles : any;

	@Input() formData: any;
	@Input() currentLB: any;
	@Input() currentLocZone: any;
	@Output() sendFormData: EventEmitter<any> = new EventEmitter<any>();

	constructor(private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
        private router: Router,
		private elbService : ELBService){
			this.loading = {};
			this.loadingError = {};
			this.objectKeys = Object.keys;
			this.schemeList = [
				{value:'internet-facing',title:'Internet Facing'},
				{value:'internal',title:'Internal'}
			];
			this.monitoringEnvList = [
				{value:'prod',title:'prod'},
				{value:'pre prod',title:'pre prod'},
				{value:'staging',title:'staging'},
				{value:'qa',title:'qa'},
				{value:'dr',title:'dr'}
			];
			this.lbProtocol = [{http : false},{https:false}]

	}

	ngOnInit() {
		this.formData['protocol'] = [];
		this.formData['vipport'] = [];
		this.formData['tcpPort'] = 1;
	}

	ngOnChanges(){
		
		this.formData['monitoringvalue'] = this.monitoringEnvList[0].value;
		
		if(this.currentLocZone && this.currentLocZone.location){
			this.getSSLCertificatesList();
		}
	}

	
	updateFormData(){
		if(this.currentLB.typeText == 'tcp'){
			this.formData['vipport'] = [this.formData.tcpPort]
		}
		this.sendFormData.emit(this.formData)
	}

	onRedirectionChange(){
		if(this.formData.redirection){
			this.lbProtocol[1].https = true;
			var idx = this.formData.protocol.indexOf('https');
			if(idx == -1){
				this.formData.protocol.push('https');
				this.formData.vipport.push(443);
			}
		}
		
		this.updateFormData()
	}

	exists = function (item) {
        return this.formData.protocol.indexOf(item) > -1;
    };

	onProtocolChange(protocol){
		var idx = this.formData.protocol.indexOf(protocol);
	
		// Is currently selected
		if (idx > -1) {
			this.formData.protocol.splice(idx,1)
			this.formData.vipport.splice(idx,1)
		}
	
		// Is newly selected
		else {
			this.formData.protocol.push(protocol);
			this.formData.vipport.push(this.currentLB.types[protocol])
		}
		this.updateFormData()
	  };


	// get ssl certificates
	getSSLCertificatesList(){

		this.loading['sslcert'] = true;
		this.loadingError['sslcert'] = false;

		this.profiles = (this.currentLocZone.zone).indexOf('2A') > -1 ? 'profiles' : undefined;

		let param = {
			location : this.currentLocZone.location,
			zone : this.currentLocZone.zone,
			type : this.profiles
		};
		
		this.elbService.getSSLCertificate(param).subscribe(data => {
			
			if(data && data.sslcerts){
				if(this.profiles){
					this.sslCertList = data.sslcerts;
					this.formData.sslcert = this.sslCertList.length > 0 ? this.sslCertList[0] : '';
				}
				else{
					this.sslCertList = data.sslcerts.filter(function(obj){
						return obj.certificatetype == 'CLIENTANDSERVER_CERT'
					})
					this.formData.sslcert = this.sslCertList.length > 0 ? this.sslCertList[0].certkey : '';
				}
			}
			else{
				this.sslCertList = [];
			}

			this.loading['sslcert'] = false;
			
		
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.loading['sslcert'] = false;
			this.loadingError['sslcert'] = true;
		})
	}

}