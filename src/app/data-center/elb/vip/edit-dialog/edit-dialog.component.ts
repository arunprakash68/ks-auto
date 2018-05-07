import { Component, Input, Output, TemplateRef,OnInit, ViewChild, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BuProjectComponent } from '../../../../shared/bu-project/bu-project.component';
import { ELBService } from '../../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';

@Component({
	selector: 'edit-dialog',
	moduleId: module.id,
	providers : [ELBService,ErrorHandlerService],
	templateUrl: './edit-dialog.component.html'

})


export class EditDialog implements OnInit {
	modalRef: BsModalRef
	formData : any; 
	confirmValue : any;
	spin : boolean;

	@Output() triggerUpdate: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('editModal') modal;

	constructor(private modalService: BsModalService,
		private elbService : ELBService,
		private errorHandlerService :  ErrorHandlerService) {
			this.spin = false;
		}

	ngOnInit(){
    }
	
    showModal(data) {
		this.formData = data;
		this.openModal(this.modal)
	}
	
	hideModal(){
		this.closeModal()
	}
   
	// open modals
	openModal(template: TemplateRef<any>) {
          this.modalRef = this.modalService.show(template, { class: 'custom-modal modal-md' });
	}

	// close modals
	closeModal() {
	  this.modalRef.hide();
	  this.modalRef = null;
    }
    
    // buproupdate
    getBuProData(data){
    }
    
    // on business change
    onBusinessChange(data){
    }

    // on project change
    onProjectChange(data){
	}
	
	onUpdate(){
		this.spin = true;
		let params = {
			lb_name : this.formData.lb_name,
			domain_name : this.formData.domain_name,
			bu : this.formData.bu,
			project : this.formData.project,
			id : this.formData.id,
		}
		this.elbService.updateELB(params).subscribe(data => {
			if(data && data['status'] == 1){
				this.spin = false;
				this.closeModal();
				this.triggerUpdate.emit(data['message'])
			}

		}, error => {
			// this.loading['membersList'][index] = false;
			// this.loadingError['membersList'][index] =  true;
				
		});
		// this.triggerUpdate.emit()
	}
  }