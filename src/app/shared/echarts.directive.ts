import { Directive, ElementRef, Input, Output, EventEmitter, HostListener, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import echarts from 'echarts';
import 'echarts/theme/macarons';
import { LayoutService } from '../layout/layout.service';

@Directive({ selector: '[myECharts]' })

export class EChartsDirective implements AfterViewInit, OnDestroy {
  el: ElementRef;
  subscription: Subscription;
  @Output() dataZoom: EventEmitter<any> = new EventEmitter<any>();

  constructor(el: ElementRef, private layoutService: LayoutService) {
    this.el = el;
    this.subscription = layoutService.echartsState$.subscribe((state) => {
      this.resizeChart(state);
    });
  }

  @Input() EChartsOptions: any;
  @Input() callResize: boolean;
  
  private myChart;
  private timer;

  ngAfterViewInit() {
    
    // this.myChart = echarts.init(this.el.nativeElement, 'macarons');
    // this.myChart.on('click', function(e) {
    //   this.clickEvent.emit(e);
    // }, this); 
    // this.myChart.on('dataZoom', function(e) {
    //   this.dataZoom.emit(e);
    // }, this); 
    // if (this.EChartsOptions['series'].length < 1) { return; }

    // if (!this.EChartsOptions) { return; }
    // console.log('echarts: ' + this.EChartsOptions['series']);
    // this.myChart.setOption(this.EChartsOptions);
  }

  graphInit() {
    this.myChart = echarts.init(this.el.nativeElement, 'macarons');
    this.myChart.on('dataZoom', function(e) {
      this.dataZoom.emit(e);
    }, this); 
  }

  ngOnChanges(changes: SimpleChanges) {
    let callResizeValues = changes['callResize'];
    if(callResizeValues && (callResizeValues.currentValue != callResizeValues.previousValue)){
      setTimeout(() => { 
        if (!this.myChart) {
          this.graphInit();
        }
          this.myChart.resize();
      }, 50);
    } else {
      if(!this.EChartsOptions){ return; }
      if (this.EChartsOptions && this.EChartsOptions['series'].length < 1) { return; }
      if (!this.myChart) {
        this.graphInit();
      }
        this.myChart.setOption(this.EChartsOptions);
      
    }
    this.resizeChart(true); 
  }

  ngOnDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null; // https://bitbucket.org/iarouse/angular-material/commits/5eec2667b5496edfa1cc0896333b83e188a35676
    }
  }

  resizeChart = (state) => {
    // console.log('state: ' + state)
    setTimeout(() => { // Important
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 50)
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeChart(true);
  }
}
