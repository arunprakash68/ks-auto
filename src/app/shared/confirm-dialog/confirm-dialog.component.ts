import { Component, Input, Output, TemplateRef,OnInit, ViewChild, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
	selector: 'confirm-dialog',
	moduleId: module.id,
	templateUrl: './confirm-dialog.component.html'

})

export class ConfirmDialog implements OnInit {
	modalRef: BsModalRef;
	modalRef2: BsModalRef;
	textStrings : any;
	confirmValue : any;

	@Output() triggerDelete: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('confirmModal') modal;
	@ViewChild('confirmModalAlert') modalAlert;

	constructor(private modalService: BsModalService) {}

	ngOnInit(){
	}

	validateValue(){
		if(this.confirmValue == this.textStrings.value){
			this.triggerDelete.emit(this.textStrings)
		}
		else{
			this.openAlertModal(this.modalAlert)
		}
		
	}

	
    showModal(textStrings) {
		this.textStrings = textStrings;
		this.confirmValue = '';
		this.openConfirmModal(this.modal)
	}
	
	hideModal(){
		this.closeConfirmModal()
	}
   
	// open modals
	openConfirmModal(template: TemplateRef<any>) {
	  	this.modalRef = this.modalService.show(template, { class: 'custom-modal confirm' });
	}
	openAlertModal(template: TemplateRef<any>) {
		let config = {
			ignoreBackdropClick: true,
			keyboard: false,
			class: 'custom-modal alert'
		};
	  	this.closeConfirmModal();
	  	this.modalRef2 = this.modalService.show(template, config);
	}

	// close modals
	closeConfirmModal() {
	  this.modalRef.hide();
	  this.modalRef = null;
	}

	closeAlertModal() {
		this.modalRef2.hide();
		this.modalRef2 = null;
		this.openConfirmModal(this.modal)
	}
  }