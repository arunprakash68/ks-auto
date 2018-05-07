import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { APPCONFIG } from '../../config';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
// import { AlertComponent } from 'ngx-bootstrap';
import * as CryptoJS from 'crypto-js';
import { AuthenticationService } from '../../_services/authentication.service';
import * as away from 'away';
import { Router, NavigationEnd } from '@angular/router';
import * as cookie from 'cookie';

@Component({
  selector: 'my-app-header',
  styles: [],
  templateUrl: './header.component.html',
  providers: [
    AuthenticationService
  ]
})

export class AppHeaderComponent implements OnInit{
  public AppConfig: any;
  textStrings: any;
  bsModalRef: BsModalRef;
  check: Boolean;
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
      // this.clearlocal();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    // this.clearlocal();
  }
  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e) {
    this.activeUser(e);
    
  }
  @HostListener('document:click', ['$event']) 
  onClick(e) {
    this.activeUser(e);
    
  }
  @HostListener('document:wheel', ['$event']) 
  wheel(e) {
    this.activeUser(e);
  }
  @HostListener('document:keydown', ['$event']) 
  onKeyDown(e) {
    this.activeUser(e);
    
  }
  @HostListener('document:touchmove', ['$event']) 
  onTouchMove(e) {
    this.activeUser(e); 
  }
  @HostListener('document:touchstart', ['$event']) 
  ontouchStart(e) {
    this.activeUser(e);  
  }
  @ViewChild('modal') modal;
  ngOnInit() {
    if(!localStorage.getItem('user')){
      this.router.navigate(['/login']);
    }
    this.AppConfig = APPCONFIG;
    
    var timer = away(this.AppConfig.sessionExpiresIn * 1000);
    var that = this;
    timer.on('idle', function() {
      var cookies = cookie.parse(document.cookie);
      if(!that.check && (!document.cookie || cookies.active !== '1')){
          that.idleactivate();
          that.check = true;
      }
      else{
        // console.log('check in else', that.check);
      }
        
    });
    timer.on('active', function() {
      that.activeUser(undefined);
    });
  }

  constructor(private modalService: BsModalService, private authenticationService: AuthenticationService, private router: Router) {
    this.textStrings = {
			header : 'Security Alert',
      body : 'Your Session has expired. Please',
      linktext: 'Reload.',
      closable: false
    }
    this.check = false;
    }
    activeUser(e){
      if(localStorage.getItem('user')){
        var cookievar = cookie.serialize('active', '1', {maxAge: this.AppConfig.sessionExpiresIn});
        document.cookie = `${cookievar}`;
        if(this.check){
          this.modal.closeAlertModal();
          this.check = false;
        }
        
      }
      else{
        if(!this.check){
          this.check = true;
          this.idleactivate();
          
        }
      }
    }
    callLoggingOutService(){
      let localdata = JSON.parse(localStorage.getItem('user'));
      let token = localdata.tokenid ? localdata.tokenid : undefined;
      this.authenticationService.loggingout(token).subscribe((data) => {
        localStorage.removeItem('user');
      }, (err) => {
        console.log('API Error - Session');
      });
    }
    clearlocal(){
      if(localStorage.getItem('user')){
        
        this.callLoggingOutService();
      }
      if(localStorage.getItem('x'))
      {
        // localStorage.removeItem('x');
      }
    }
  sessionpop(textStrings: any){
    
    let secretvars = localStorage.getItem('x');
    var bytes  = CryptoJS.AES.decrypt(secretvars, 'momuoyevol');
    var secretvarsfinal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
        this.authenticationService.login(secretvarsfinal.email, secretvarsfinal.password).subscribe((data) => {
          localStorage.setItem('user', JSON.stringify(data['result']));
          this.check = false;
          // console.log('status modal: ',this.check);
        });

  }
  idleactivate(){
    // console.log(localStorage.getItem('user'));
		if(localStorage.getItem('user')){
			this.callLoggingOutService();
		
    }
    this.modal.showModal(this.textStrings);
  }

  triggerlogout(){
    if(localStorage.getItem('user')){
			let localdata = JSON.parse(localStorage.getItem('user'));
			let token = localdata.tokenid ? localdata.tokenid : undefined;
			this.authenticationService.loggingout(token).subscribe((data) => {
        this.authenticationService.logout();
				this.router.navigate(['/login']);
			}, (err) => {
				console.log('API Error - LO');
			});
			
		}
		
  }

  goToHelpPage(){
    localStorage.removeItem('EngineerLocation');
    localStorage.removeItem('TicketLocation');
    localStorage.removeItem('EngineerName');
    localStorage.removeItem('SelectedTab');
    
  }
}
