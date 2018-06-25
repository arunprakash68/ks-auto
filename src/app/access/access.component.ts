import { Component, Input, Output, EventEmitter, TemplateRef, SimpleChanges, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as jQuery from 'jquery';
import { AccessService } from '../_services/access.service';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import validator from 'validator';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
  providers: [ErrorHandlerService, AccessService],
})
export class AccessComponent implements OnInit {

  isFilterCollapsed: boolean;
	staticTab: any;
	dynamicTabs: any[];
	loading: any;
  
  pagination: any;

  userListError:any;
  userList:any;
  userListHelper: any;

  searchparams: any;
  issuper: any;

  form1: any;
  form2: any;
  userformDetail: any;
  searchEmail: any;
  emailList: any;
  dropdownSetting: any;
  searchparam: any;
  

  constructor(private accessService: AccessService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router) { 

      this.staticTab = {
        active: true
      };
      this.isFilterCollapsed = false;

      this.loading = true;
      this.userListError = false;

      this.searchparams = {
        lowercap: 0,
        uppercap: 16
      };
      this.issuper = 0;

      this.form1 = false;
      this.form2 = false;
      this.userformDetail = {};
      this.searchparam = {
        query: 'ID as id, EMAIL as itemName'
      };
      this.pagination = {
        page: 1,
        pageSize: 16,
        maxSize: 5,
        rotate: true,
        boundaryLinks: true,
        pageItemIndex: 0,
        collectionSize: 0,
        totalSize: 0,
      };
    
  }

  ngOnInit() {
    this.getEmailList();
    this.dropdownSetting = { 
      singleSelection: true, 
      text:"Select User",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class"
    };
    this.isSuperUser();
    this.getUsers(true);

  }
  ngOnChanges(change: SimpleChanges) {
		if(change['updatedSearchOptions'] && change['updatedSearchOptions']['currentValue']) {
			
			// this.searchOptions = this.updatedSearchOptions;
			// this.searchOptions['from'] = 0,
			// this.searchOptions['size'] = this.pagination.pageSize;
			// this.pageChange(1);
		} else {
		}
	}
  getEmailList(){
  
    this.accessService.fetchUserAll(this.searchparam).subscribe(data => {
      this.emailList = data;
      // console.log(data);
      this.pagination = {
        page: 1,
        pageSize: 16,
        maxSize: 5,
        rotate: true,
        boundaryLinks: true,
        pageItemIndex: 0,
        collectionSize : data.result.length,
        totalSize: 0,
      }
      
    }, error => {
    });
  }
  refresh(a){
    this.form1 = false;
    this.form2 = false;
    this.isSuperUser();
    this.getUsers(true);
  }
  isSuperUser(){
    this.accessService.isSuperuser().subscribe(data => {
      this.issuper = data.status;
    },error => {

    });
  }
  getUsers(a) {
    this.searchEmail = new Array();
		this.loading = true;
    this.userListError = false;
    if(a == false){
      this.loading = false;
      this.userListError = false;
    }
		this.accessService.fetchAll(this.searchparams).subscribe(data => {
      // console.log(data);
			  this.loading = false;
        var reslogs = [];
        for(let i=0; i<data.result.length*2;i+=2)
				{
					if(i === 0)
					{
						reslogs[i] = Object.create(data.result[i]);
						reslogs[i]['dynamicRow']=false;
            reslogs[i]['expandDetails']=false;
            reslogs[i]['form']=false;
						reslogs[i+1] = Object.create(data.result[i]);
						reslogs[i+1]['dynamicRow']=true;
						reslogs[i+1]['expandDetails']=false;
					}
					else{
						reslogs[i] = Object.create(data.result[i/2]);
						reslogs[i]['dynamicRow']=false;
            reslogs[i]['expandDetails']=false;
            reslogs[i]['form']=false;
						reslogs[i+1] = Object.create(data.result[i/2]);
						reslogs[i+1]['dynamicRow']=true;
						reslogs[i+1]['expandDetails']=false;
          }
          if(reslogs[i].rights.length > 0){
            for(let j=0; j<reslogs[i].rights.length; j++){
              // console.log(j,data.result[i].rights[j]);
              // console.log((i==0)?'1':(i/2), reslogs[i].rights.length);
              reslogs[i].rights[j]['accessform']=false;
            }
            
          }
          else{
            // console.log('else');
          }
          
          
					
					
				}
				var obj = Object.create(data);
				obj.result = reslogs;
        this.userList = obj;
        // console.log('all',this.userList);
						
					
				
		}, error => {
			this.userList = null;
			this.loading = false;
			this.userListError = true;
		});

  }
  triggerlog(index, user){
    if(this.userList.result[index].expandDetails)
		{
			this.userList.result[index].expandDetails = false;
		}
		else{
			this.userList.result[index].expandDetails = true;
		}
  }
  deleteUser(index, EMAIL){
    let obj = {
      email:EMAIL
    }
    // console.log(index,this.userList);
    this.accessService.deleteUser(obj).subscribe(data => {
      // this.userList.result.splice(index, 2);
      this.form1 = false;
      this.form2 = false;
      this.getUsers(true);
    },error => {

    });
  }
  deleteaccess(superindex, index, AID){
    let obj = {
      id:AID
    }
    this.accessService.deleteAccess(obj).subscribe(data => {
      this.userList.result[superindex].rights.splice(index, 1);
      this.form1 = false;
      this.form2 = false;
    },error => {

    });
  }
  updateUser(operationinst, index){
    
    if(this.userList.result[index].form == true && operationinst == true){
      
      if(!validator.isEmpty(this.userList.result[index].ID.toString()) && !validator.isEmpty(this.userList.result[index].NAME) && !validator.isEmpty(this.userList.result[index].EMAIL)){
        if(validator.isEmail(this.userList.result[index].EMAIL)){
          let obj = {
            id: this.userList.result[index].ID,
            name: this.userList.result[index].NAME,
            email: this.userList.result[index].EMAIL,
            super_user: this.userList.result[index].SUPER_USER ? this.userList.result[index].SUPER_USER : 0
          }
          this.accessService.updateUser(obj).subscribe(data => {
             
             this.userdetailUpdate(obj.id, index);
          },error => {
            alert('Something went wrong. Please try again later.');
          });
        }
        else{
          alert('Please provide genuine email.');
        }
      }
      else{
        alert('All fields are mandatory. Please provide.');
      }
      
     
      
    }
    else{
      this.userList.result[index].form = true;
    }
    
  }
  cancelUserUpdate(id, index){
    this.userList.result[index].form = false;
    this.userdetailUpdate(id, index);
  }

  userdetailUpdate(id, index){
    let obj = {
      id:id
    }
    this.accessService.fetchUser(obj).subscribe(data => {
      this.userList.result[index].EMAIL = data.result[0].EMAIL;
      this.userList.result[index].NAME = data.result[0].NAME;
      this.userList.result[index].SUPER_USER = data.result[0].SUPER_USER;
      // this.userList.result[index] = data.result[0];
      this.userList.result[index].dynamicRow =false;
      this.userList.result[index].expandDetails =false;
      this.userList.result[index].form =false;
    },error => {
      console.log('user detail update error');
    });
  }

  activateform(a){
    if(a=='form1'){
      if(this.form1==false){
        this.form1 = true;
        this.form2 = false;
      }
      else{
        this.form1 = false;
      }
    }
    else{
      if(this.form2==false){
        this.form2 = true;
        this.form1 = false;
      }
      else{
        this.form2 = false;
      }
    }
  }
  collapseform(a){
    if(a=='form1'){
      return this.form1 = false;
    }
    this.form2 = false;
  }
  refreshList(a){
    this.getEmailList();
    this.getUsers(false);
  }

  updateAccess(a, superindex, index){
    if(this.userList.result[superindex].rights[index].accessform == true && a){
      let obj = {
        aid: this.userList.result[superindex].rights[index].AID,
        access_type: this.userList.result[superindex].rights[index].ACCESS_TYPE
      }
      this.accessService.updateAccess(obj).subscribe(data => {
        this.useraccessUpdate(this.userList.result[superindex].rights[index].AID, superindex, index);
      },error => {
        alert('Something went wrong. Please try again later.');
      });
    }
    else{
      this.userList.result[superindex].rights[index].accessform = true;
    }
  }
  cancelAccessUpdate(a, superindex, index){
    this.userList.result[superindex].rights[index].accessform = false;
    this.useraccessUpdate(a, superindex, index);
  }
  useraccessUpdate(a, superindex, index){
    let obj = {
      aid:a
    }
    this.accessService.fetchAccess(obj).subscribe(data => {
      this.userList.result[superindex].rights[index].ACCESS_TYPE = data.result[0].ACCESS_TYPE;
      this.userList.result[superindex].rights[index].accessform = false;
    },error => {
      console.log('user access detail update error');
    });
  }
  onItemSelect(item:any){
    this.form1 = false;
    this.form2 = false;
    this.userListHelper = this.userList;
    let param = {
      email : this.searchEmail[0].itemName
    }
    this.loading = true;
    this.accessService.fetchUser(param).subscribe(data => {
      // console.log(data);
			this.loading = false;
        var reslogs = [];
        
						reslogs[0] = Object.create(data.result[0]);
						reslogs[0]['dynamicRow']=false;
            reslogs[0]['expandDetails']=false;
            reslogs[0]['form']=false;
						reslogs[1] = Object.create(data.result[0]);
						reslogs[1]['dynamicRow']=true;
						reslogs[1]['expandDetails']=false;
					
          if(reslogs[0].rights.length > 0){
            for(let j=0; j<reslogs[0].rights.length; j++){
              reslogs[0].rights[j]['accessform']=false;
            }
            
          }
          else{
            // console.log('else');
          }
				var obj = Object.create(data);
				obj.result = reslogs;
        this.userList = obj;
						
					
				
		}, error => {
      this.loading = false;
		});
}
OnItemDeSelect(item:any){
  this.form1 = false;
    this.form2 = false;
    this.userList = this.userListHelper;
}
onSelectAll(items: any){
    // console.log(items);
}
onDeSelectAll(items: any){
    // console.log(items);
}
pageChange(currPage){
  // console.log(currPage);
  this.form1 = false;
  this.form2 = false; 
  this.pagination.page = currPage;
  this.pagination.pageItemIndex = (16*currPage)-16;
  this.searchparams = {
    lowercap: this.pagination.pageItemIndex,
    uppercap: this.pagination.pageSize
  };
  // this.searchOptions['from'] = (this.pagination.page - 1) * this.pagination.pageSize;
  this.getUsers(true);
}
showPagination() {
  if (this.loading) {
    return false;
  }
  if(this.userListError) {
    return false;	
  }
  if(this.searchEmail.length>0){
    return false;
  }
  return true;
}

}
