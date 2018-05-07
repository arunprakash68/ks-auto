import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-volumes',
  templateUrl: './volumes.component.html'
})
export class VolumesComponent implements OnInit {

  staticBillingTab: any;
  dynamicTabs: any[];
  isCollapsed: boolean;

  searchOptions: any;
	formData: any;
	searchTags: any;
	envMap : any;
	action: any;
	volumeDetailsList: any;
  
  constructor() { 
    this.staticBillingTab = {
      active: true
    };
    this.isCollapsed = false;
    this.formData = {};
		this.searchOptions = {};
		this.searchTags = [];
		this.envMap = {
			1 : 'prod',
			2 : 'preprod',
			3 : 'staging',
			4 : 'qa',
			5 : 'dr'
		}
		this.action = {
			'detach': false,
			'attach': false,
			'delete': false
		}
		this.volumeDetailsList = {};
  }

  ngOnInit() {
  }
  triggerAction(params: any, check: boolean = false){
	//   console.log('value of selected volume in parent:',params);
	  if(check){
		if(params.status == 'Active'){
			this.action = {
				'detach': true,
				'attach': false,
				'delete': false
			}
		}
		else if(params.status == 'available'){
			this.action = {
				'detach': false,
				'attach': true,
				'delete': true
			}
		}
	  }
	  else{
		let keysArr = Object.keys(params);
		keysArr.length == 1 ? this.triggerAction(params[keysArr[0]], true) : this.action = {
			'detach': false,
			'attach': false,
			'delete': false
		};
	  }
	
	
  }
  updateVolumeDetailsList(volumeDetailsList: any){
	this.volumeDetailsList = volumeDetailsList;
  }
  clearAction(params: any){
	
	  let keysArr = Object.keys(this.volumeDetailsList);
		keysArr.length == 1 ? this.triggerAction(this.volumeDetailsList[keysArr[0]], true) : this.action = {
			'detach': false,
			'attach': false,
			'delete': false
		};
}
  triggerFilterCollapse(collapse: boolean) {
		this.isCollapsed = !this.isCollapsed;
  }
  updateSearchOptions(_searchOptions: any) {
		this.searchOptions = _searchOptions;
		
		this.updateSearchTags()
		this.triggerFilterCollapse(true)
	}

	updateSearchTags(){
		let obj = this.searchOptions;
		let map = this.envMap;
		this.searchTags = Object.keys(obj).reduce(function(filtered, option) {
			if (obj[option] != '' && option != 'start_count') {
			   let tag = { 
				   closable: true, 
				   prop: option,
				   title: option == 'env' ? map[obj[option]] : obj[option]
				}
			   filtered.push(tag);
			}
			return filtered;
		}, []);
	}

	triggerCloseTag(tag) {
		if (tag.prop == 'business') {
			this.searchTags.length = 0;
			let count = this.searchOptions.start_count;
			this.searchOptions = {
				start_count : count
			}
		} 
		else{
			for(let i = 0; i <  this.searchTags.length; i++) {
				if(this.searchTags[i].prop == tag.prop) {
					this.searchTags.splice(i,1);
					break;
				}
			}
			let temp =  JSON.parse(JSON.stringify(this.searchOptions));
			temp[tag.prop] = '';
			this.searchOptions = temp;

			if (tag.prop == 'project') {
				this.triggerCloseTag({prop: 'zone'});
			}
		}
	}
	detachVolume(state: boolean){
		if(state){
			console.log('clicked right');
		}
	}
	attachVolume(state: boolean){
		if(state){
			console.log('clicked right');
		}
	}
	deleteVolume(state: boolean){
		if(state){
			console.log('clicked right');
		}
	}

}
