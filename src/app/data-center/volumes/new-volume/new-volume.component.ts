import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CreateNewELBService } from '../../../_services/data-center/elb-new.service';
import { LocationZoneListService } from '../../../_services/location-zone-list.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { ServicesUtilityService } from '../../../_services/services-utility.service';
import { Router, NavigationEnd } from '@angular/router';

import { ImageTextBoxComponent } from '../../../shared/img-text-box/img-text-box.component';

@Component({
  selector: 'new-volume',
  templateUrl: './new-volume.component.html',
  providers: [CreateNewELBService, ServicesUtilityService, ErrorHandlerService, LocationZoneListService],
})
export class NewVolumeComponent implements OnInit {
  projects: any;
	businessAccessDetails: any;
	newELBData: any;
	formData: any;
	loadBalancerList : any;
	locationList: any;
	objectKeys : any;
	loading: any;
	loadingError: any;
	currentLocZone: any;
	currentBuProject: any;
	submitLoading: any;
	submitError: any;
	newVipData : any;
	newPoolData : any;
	newMonitorData : any;
	locImgMap : any;
	attachedData : any;
	spin : any;
	observables : any[];
  observablesAttach: any[];
  
  constructor(private createNewELBService: CreateNewELBService,
		private errorHandlerService: ErrorHandlerService,
		private servicesUtilityService: ServicesUtilityService,
		private router: Router,
		private locationZoneListService : LocationZoneListService) {
      this.loading = {};
		this.loadingError = {};
		this.submitLoading = {};
		this.submitError = {};
		this.projects = {};
		this.attachedData = {};
		this.observables = [];
		this.observablesAttach = [];

		this.objectKeys = Object.keys;
		
		this.loadBalancerList = {
			application:{
				typeText:'http https',
				types:{
					http : 80,
					https : 443
				}
			},
			network:{
				typeText:'tcp',
				types:{
					tcp : ""
				}
			}
		}
		this.formData = {
			loadBalancerType : 'application',
			scheme : 'internet-facing',
			siteshield : false,
			redirection : false
		};

		this.locImgMap = {
			Chennai : 'chennai.jpg',
			Mumbai : 'mumbai.jpg'
		}

     }

     ngOnInit() {
      this.getLocationZoneList();
    }
  
    // bu project component update
    getBuProData(data){
      this.businessAccessDetails = data.businessAccessDetails;
      this.projects = data.projects
    }
  
    onBusinessChange(data) {
      this.formData['bu'] = data.bu;
  
      if(this.projects && this.projects[this.formData['bu']].length > 0) {
        this.formData['project'] = this.projects[this.formData['bu']][0]['project'];
      }
      this.onProjectChange(false);
    }
  
    onProjectChange(data){
      if(data){
        this.formData['bu'] = data.bu;
        this.formData['project'] = data.project;
      }
      this.currentBuProject = {
        bu : this.formData.bu,
        project : this.formData.project
      }
    }
  
    updateFormData(formData : any) {
      this.formData = formData;
    }
  
  
    
  
    /*********** zone mapping/ get locations *********/
    getLocationZoneList() {
      if(this.locationList) {
        return;
      }
      this.loading['loc'] = true;
      this.loadingError['loc'] = false;
      this.locationZoneListService.getLocationZones().subscribe(data => {
        
        if(data && data.loc){
          let list = Object.keys(data.loc).map(function(loc){
            return data.loc[loc].map(function(zone){
              return {location : loc, zone : zone}
            })
          })
          this.locationList = [].concat(...list);
        }
        else{
          this.locationList = [];
        }
  
        this.loading['loc'] = false;
        this.formData.locZone = this.locationList[0];
        
        this.onZoneChange();
      
      }, error => {
        if (!this.errorHandlerService.validateAuthentication(error)) {
          this.router.navigate(['/login']);
        }
        this.loading['loc'] = false;
        this.loadingError['loc'] = true;
      })
    }
  
    // on zone location change
    onZoneChange(){
      this.formData.location = this.formData.locZone.location;
      this.formData.zone = this.formData.locZone.zone;
  
      this.currentLocZone = {
        location : this.formData.location,
        zone : this.formData.zone
      }
    }
  
    // create vip
    createVip(params){
      let options = {
        vipname : this.formData.vipname,
        vipport : this.formData.vipport.map(String),
        project : this.formData.project,
        bu : this.formData.bu,
        env : parseInt(this.formData.monitoringvalue),
        scheme : this.formData.scheme,
        lb_method : this.formData.lbmethod,
        siteshield : (this.formData.scheme == 'internet-facing' && this.formData.loadBalancerType == 'application') ? 
                (this.formData.siteshield ? 1 : 0) : 0,
        // snatpool : this.formData.snatPool
      }
  
      options = {...options,...params}
      
      this.observables.push(this.createNewELBService.createNewELBVip(options))
    }
  
    // create pool
    createPool(params){
      let data =  this.formData;
      let options = {
        project : data.project,
        bu : data.bu,
        env : parseInt(data.monitoringvalue),
        port : [data.port.toString()],
        vipmembers : data.vipmembers,
        lb_method : data.lbmethod,
        lb_type : data.loadBalancerType == "application" ? 'http' : 'tcp'
      }
  
      options = {...options,...params}
  
      this.observables.push(this.createNewELBService.createNewELBPool(options))
    }
  
    // create monitor
    createMonitor(params){
      let options = {
        send_string : this.formData.send_string,
        recv_string : this.formData.recv_string,
      }
  
      options = {...options,...params}
  
      this.observables.push(this.createNewELBService.createNewELBMonitor(options))
    }
  
    // attach monitor to pool
    attachMonitorPool(params){
      let options = {
        monitorname : this.newMonitorData.monitorname,
        poolname : this.newPoolData.servicegroup
      }
  
      options = {...options,...params}
  
      this.observablesAttach.push(this.createNewELBService.attachMonitorPool(options))
    }
  
    // attach vip to pool
    attachPoolVip(vipname,params){
      let options = {
        vipname : vipname,
        poolname : this.newPoolData.servicegroup
      }
  
      options = {...options,...params}
  
      this.observablesAttach.push(this.createNewELBService.attachPoolVip(options))
    }
  
    // create ssl to vip
    attachSslVip(vipname,params){
      let options = {
        vipname : vipname,
        sslcertname : this.formData.sslcert
      }
  
      options = {...options,...params}
      
      this.createNewELBService.attachSslVip(options).subscribe(data => {
        this.submitLoading['attachssl'] = false;
        if(data && data['status'] == 1) {
          this.attachedData.isSslAttached = true;
        } else {
          this.attachedData.isSslAttached = false;
        }
  
      }, error => {
        if (!this.errorHandlerService.validateAuthentication(error)) {
          this.router.navigate(['/login']);
        }
        this.submitError['error'] = true;
        this.submitError['message'] = 'Something went wrong. Please try after a while.'
      })
    }
  
    // enable redirection from http to https
    enableRedirection(vipname,params){
      let options = {
        vipname : vipname
      }
  
      options = {...options,...params}
      
      this.createNewELBService.sslRedirect(options).subscribe(data => {
        this.submitLoading['redirectssl'] = false;
        if(data && data['status'] == 1) {
          this.attachedData.isSslRedirect = true;
        } else {
          this.attachedData.isSslRedirect = false;
        }
  
      }, error => {
        if (!this.errorHandlerService.validateAuthentication(error)) {
          this.router.navigate(['/login']);
        }
        this.submitError['error'] = true;
        this.submitError['message'] = 'Something went wrong. Please try after a while.'
      })
    }
  
    // call functions for attaching vip,pool,monitor,ssl, enabling redirection -  fork join
    callAttach(data){
      this.newELBData = data[0];
      this.newPoolData = data[1];
      this.newMonitorData = data[2];
  
      let params = {
        zone : this.formData.zone,
        location : this.formData.location,
      }
  
      // attach pool/ssl and enable redirection
      let vipnames = this.newELBData.vipnames;
      for(let idx = 0;idx<vipnames.length; idx++){
        if(vipnames[idx].indexOf('443') > -1 && this.formData.sslcert){
          this.attachSslVip(vipnames[idx],params);
        }
        if(vipnames[idx].indexOf('80') > -1 && this.formData.redirection){
          this.enableRedirection(vipnames[idx],params);
        }
        this.attachPoolVip(vipnames[idx],params);
      }
  
      this.attachMonitorPool(params);
  
      
      Observable.forkJoin(this.observablesAttach).subscribe(
        (result) => {
          let isCreated = result.every(function(obj){return obj? obj['status'] == 1 : false});
          // if all returned status 1
          if(isCreated){
            this.router.navigate(['/app/data-center/elb/vip']);
          }
          else{
            this.submitError['error'] = true;
            this.submitError['message'] = 'Something went wrong. Please try after a while.'
          }
        }
      )
    }
  
    // check if valid domain name is entered
    validateDomain(domain){
      let domainFormat = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
      return domainFormat.test(domain)
    }
  
    // alert messages if requred fields are not entered
    validateFormData(){
      let data = this.formData;
      if(!data.domain_name || !data.send_string || !data.recv_string){
        alert("All input fields are required");
        return false;
      }
      if(!this.validateDomain(data.domain_name)){
        alert("Invalid domain name");
        return false;
      }
      if(data.vipport.length == 0){
        alert("Please select vip port");
        return false;
      }
      if(data.loadBalancerType == 'network' && (data.tcpPort == 80 || data.tcpPort == 443)){
        alert("TCP Port cannot be " + data.tcpPort)
        return;
      }
      if(data.vipmembers.length == 0){
        alert("Please select VIP Members");
        return false;
      }
      else{
        return true;
      }
    }
  
    // on submit
    onCreate(){
      if(!this.validateFormData()){
        return;
      }
      
      this.spin = true;
  
      // common params
      let params = {
        zone : this.formData.zone,
        location : this.formData.location,
        domain_name : this.formData.domain_name,
      }
  
      this.createVip(params);
      this.createPool(params);
      this.createMonitor(params);
  
      Observable.forkJoin(this.observables).subscribe(
        (result) => {
          let isCreated = result.every(function(obj){return obj? obj['status'] == 1 : false});
          // if all returned status 1
          if(isCreated){
            this.callAttach(result)
          }
          else{
            this.submitError['error'] = true;
            this.submitError['message'] = 'Something went wrong. Please try after a while.'
          }
        }
      )
    }

}
