import { Component,OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BusinessAccessDetailsService } from '../../_services/business-access-details.service';
import { AccessService} from './../../_services/access.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import validator from 'validator';

@Component({
  selector: 'app-adduser-form',
  templateUrl: './adduser-form.component.html',
  providers: [BusinessAccessDetailsService, ErrorHandlerService, AccessService],
})
export class AdduserFormComponent implements OnInit {
  formData: any;
  formErrorMsg: any;
  formSuccessMsg: any;
  @Output() triggerrefresh: EventEmitter<any> = new EventEmitter<any>();
  @Output() triggeradduserCollapse: EventEmitter<any> = new EventEmitter<any>();
  loader : any;

  constructor(private accessService: AccessService, private businessAccessDetailsService: BusinessAccessDetailsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { 
      this.formData = {
        fullname: undefined,
        email: undefined,
        superuser: undefined
      }
      this.formErrorMsg = undefined;
      this.formSuccessMsg = undefined;
      this.loader = undefined;
    }

  ngOnInit() {
  }

  triggerCollapse(){
    this.triggeradduserCollapse.emit('form1');
  }
  onSubmit(a){
    
    if(!validator.isEmpty(this.formData.fullname) && !validator.isEmpty(this.formData.email)){
        if(validator.isEmail(this.formData.email)){
          this.formErrorMsg = undefined;
          this.loader = true;
          this.accessService.addUser(this.formData).subscribe(data => {
            this.formData = {
              fullname: undefined,
              email: undefined,
              superuser: undefined
            }
            this.loader = false;
            this.formSuccessMsg = 'User Created...';
            this.triggerrefresh.emit('true');
          }, error => {
            this.loader = false;
            this.formSuccessMsg = undefined;
            this.formErrorMsg = 'Something went wrong. please try again later.';
          });
        }
        else{
          this.formSuccessMsg = undefined;
          this.formErrorMsg = 'Please provide genuine email.';
        }
    }
    else{
      this.formSuccessMsg = undefined;
      this.formErrorMsg = 'All fields are required.';
    }
    
  }
  hidealert(){
    this.formSuccessMsg = undefined;
    this.formErrorMsg = undefined;
  }

}
