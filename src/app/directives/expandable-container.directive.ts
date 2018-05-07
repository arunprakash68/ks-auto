import { Directive, Input, ElementRef, AfterViewInit, APP_INITIALIZER } from '@angular/core';

@Directive({selector: '[expandableCont]'})

export class ExpandableContainerDirective implements AfterViewInit {

    el: ElementRef;
    @Input() update : any;
    containerHeight :  any;
    nbpanels : any;

	constructor(el: ElementRef) {
		this.el = el;
	}

    
    // initialize panel height
    initialize(){
            
        // init
        let panel = document.getElementsByClassName('panel')

        this.containerHeight = (window.innerHeight - 280);
        this.nbpanels = this.update ? 2 : 1;
        let height = (this.containerHeight / this.nbpanels) - 6;
        if(Object.keys($(panel[1])).length == 0){
            setTimeout(()=>{
                $(panel[1]).height(this.containerHeight - height - 8);
            },0)
        }
        
        
        $(panel).height(height);
    }

    ngOnChanges(){
        this.initialize();
    }
	ngAfterViewInit() {  
        
        this.initialize();
            
            let _this = this;
            $(window).resize(function() {
                _this.initialize();
            }).resize();

            $(".panel").resizable({
                handles: 's',
                minHeight: 30,
                maxHeight: (_this.containerHeight - 50),
                containment: ".container-expandable",
                
                resize: function(event, ui){
                    var currentHg = ui.size.height;
                    // set the content panel width
                    $(".panel").height(_this.containerHeight - currentHg - 7);
                    $(this).height(currentHg);
                }
            });
    }
    

}