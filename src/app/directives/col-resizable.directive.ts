import { Directive, Input, ElementRef, AfterViewInit, Renderer } from '@angular/core';

@Directive({selector: '[colResize]'})

export class ColResizeDirective implements AfterViewInit {

    el: ElementRef;
    resize :  any;

	constructor(el: ElementRef, private renderer :  Renderer) {
        this.el = el;
        this.resize = {};
	}

	ngAfterViewInit() {

		const $triggerElement = $(this.el.nativeElement);
		

		$triggerElement.on('mousedown', (event) => {
            let mouseEvent = event.originalEvent; 
			let resize = this.resize;
            resize.start = event.target;
            resize.pressed = true;
            resize.startX = mouseEvent['x'];
            resize.startWidth = $(resize.start).parent().width();
            this.initResizableColumns();
		})
    }
    
    initResizableColumns(){
		let resize = this.resize;

		this.renderer.listenGlobal('body', 'mousemove', (event) => {
			if(resize.pressed) {
			   let width = resize.startWidth + (event.x - resize.startX);
			   $(resize.start).parent().css({'min-width': width, 'max-width': width});
			   let index = $(resize.start).parent().index() + 1;
			   $('.table-custom tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width});
			}
		 });
		 this.renderer.listenGlobal('body', 'mouseup', (event) => {
		 if(resize.pressed) {
			 resize.pressed = false;
		 }
	   });
	}

}