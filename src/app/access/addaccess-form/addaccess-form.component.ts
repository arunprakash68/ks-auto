import { Component,OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BusinessAccessDetailsService } from '../../_services/business-access-details.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { AccessService} from './../../_services/access.service';
import validator from 'validator';
import { ServerMonitoringService } from '../../_services/monitoring-service/server-monitoring.service';

@Component({
  selector: 'app-addaccess-form',
  templateUrl: './addaccess-form.component.html',
  styleUrls: ['./addaccess-form.component.scss'],
  providers: [BusinessAccessDetailsService, ErrorHandlerService, AccessService, ServerMonitoringService],
})
export class AddaccessFormComponent implements OnInit {
  dropdownList = [];
  dropdownSettings = {};
  dropdownSettings2 = {};
  formData: any;
  emailList: any;
  searchparams: any;
  businessAccessDetails: any;
  realBuList: any;
  projectList: any;

  formErrorMsg:any;
  formSuccessMsg: any;
  check: any;
  check1: any;
  loader: any;

  @Output() triggeraddaccessCollapse: EventEmitter<any> = new EventEmitter<any>();
  @Output() triggerrefresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(private businessAccessDetailsService: BusinessAccessDetailsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private accessService:AccessService,
    private serverMonitoringService: ServerMonitoringService) { 
      this.searchparams = {
        query: 'ID as id, EMAIL as itemName'
      };
      this.businessAccessDetails = [];
      this.projectList = [];
      this.formData = [{
        show:false,
        approver: JSON.parse(window.localStorage.user).displayName,
        dropdownList: new Array(),
        projects: new Array(),
      }];
      this.formErrorMsg = undefined;
      this.formSuccessMsg = undefined;
      this.check = 0;
      this.check1 = 1;
      this.loader = undefined;
      
    }

  ngOnInit() {
    
    this.dropdownList = [];
    this.dropdownSettings = { 
          singleSelection: false, 
          text:"Select Projects",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
        };     
    this.dropdownSettings2 = { 
          singleSelection: true, 
          text:"Select Email",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
        };

        this.getEmailList();
        this.getBusinessUnits();

  

  }
  onItemSelect(item:any){
    // console.log(item);
    // console.log(this.formData.projects);
}
OnItemDeSelect(item:any){
    // console.log(item);
    // console.log(this.formData.projects);
}
onSelectAll(items: any){
    // console.log(items);
}
onDeSelectAll(items: any){
    // console.log(items);
}

onBusinessSelected(index){
  this.formData[index].projects = [];
  
  if(this.formData[0].id != undefined && this.formData[0].id != ''){
    
    this.formErrorMsg = undefined;
    this.getProjectsList({
      business: this.formData[index].business
    },index);
    // console.log(this.formData);
    
  }
  else{
    this.formErrorMsg = 'Please Select Email first then BU to Activate projects.';
  }
  
}
getProjectsList(options,index) {
  
  this.dropdownList = [];
  this.formData[index].dropdownList = [];
  let res = this.realBuList.filter((bu) => {
    return bu.bu_name == options.business;
  });
  let par = {
    id: this.formData[0].id[0].id,
    business: this.formData[index].business
  }
  this.accessService.fetchAccessbyuser(par).subscribe((data) => {
    // console.log('asdf',data);
    this.projectList = res[0].project;
  for(let i=0;i<this.projectList.length;i++){
    this.check1 = 1;
    for(let j=0; j<data.result.length; j++){
      if(this.projectList[i].project != data.result[j].PROJECT){
        this.check1 = 1;
        
      }
      else{
        this.check1 = 0;
        break;
      }
    }
    if(this.check1){
      let preres = {
        id: this.projectList[i].project_id,
        itemName: this.projectList[i].project
      }
      this.dropdownList.push(preres);
      this.formData[index].dropdownList.push(preres);
    }
    
    
  }
  },error => {
    this.formSuccessMsg = undefined;
    this.formErrorMsg = 'Something went wrong. please try again later.';
  });
  
  
}
getBusinessUnits(){
  this.businessAccessDetailsService.getBusinessAccessDetails().subscribe(data => {
    this.realBuList = data['bu'];
    if (data && data['status'] != 0) {
      this.businessAccessDetails = data['bu'].map(function(obj){
        return obj.bu_name;
      });
      // console.log('BU: ',this.businessAccessDetails);
    }
  },error => {

  });
}
getEmailList(){
  
  this.accessService.fetchUserAll(this.searchparams).subscribe(data => {
    this.emailList = data;
    
  }, error => {
  });
}
  triggerCollapse(){
    this.triggeraddaccessCollapse.emit('form2');
  }
  onSubmit(a){
    for(let i=0;i<this.formData.length;i++){
      if(this.formData[i].projects.length>0){
        // if(i==1){
        //   console.log('asdf',this.formData[i]);
        // }
        for(let j=0;j<this.formData[i].projects.length;j++){
          if(!validator.isEmpty(this.formData[0].id.toString()) && !validator.isEmpty(this.formData[i].business) && this.formData[i].projects.length>0){
            if(i>0 && this.check == 0){
              break;
            }
            this.check = 1;
          }
          else{
            this.check = 0;
            break;
  
          }
        }
      }
      else{
        this.check = 0;
        
      }
    }
    if(this.check == 1){
      for(let i=0;i<this.formData.length;i++){
        if(this.formData[i].projects){
          for(let j=0;j<this.formData[i].projects.length;j++){
            if(i == 0 && j == 0){
              this.loader = true;
              this.formErrorMsg = undefined;
            }
            
              let param = {
                id: this.formData[0].id[0].id,
              approver: this.formData[0].approver,
              project: this.formData[i].projects[j].itemName,
              costcenter: this.formData[i].business,
              access_type: this.formData[i].accesstype ? this.formData[i].accesstype : undefined
  
              }
              this.accessService.addAccess(param).subscribe(data => {
                if(i == (this.formData.length-1) && j == (this.formData[i].projects.length-1)){
                  this.loader = false;
                  this.formSuccessMsg = 'Access Added...';
                  this.formData = [{
                    show:false,
                    approver: JSON.parse(window.localStorage.user).displayName,
                    dropdownList: new Array(),
                    projects: new Array()
                  }];
                  this.triggerrefresh.emit('true');
                }
              
            }, error => {
              this.loader = false;
              this.formSuccessMsg = undefined;
              this.formErrorMsg = 'Something went wrong. please try again later.';
            });

          }
        }
      }
    
  }
  else{
    this.formSuccessMsg = undefined;
    this.formErrorMsg = 'All fields are Mandatory except AccessType.';

  }
  }
  addRow(a){
    this.formSuccessMsg = undefined;
    this.formData.push({show: a, dropdownList: [], projects: []});
    // console.log('add',this.formData);
  }
  deleteRow(index){
    this.formData.splice(index, 1);
    // console.log('delete',this.formData);
  }
  hidealert(){
    this.formSuccessMsg = undefined;
    this.formErrorMsg = undefined;
  }

}
