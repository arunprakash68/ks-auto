import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CHARTCONFIG } from './charts.config';


export interface LineGraphDataModel {
	name: string;
	data: any[];
}

@Component({
  selector: 'stack-line-graph',
  styles: [],
  providers: [],
  templateUrl: './stack-line-graph.component.html'
})

export class StackLineGraphComponent {
  @Input() graphData: any[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() loadingNoData: boolean;
  @Input() callResize: boolean;
  @Output() reloadGraphData: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataZoom: EventEmitter<any> = new EventEmitter<any>();
  @Output() mouseUpEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() mouseDownEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() tabperformance: any;
  stackLine: any;
  config: any;


  ngOnChanges() {
    this.loadingNoData = false;
    if (this.loading) {
      return;
    }
    let graphData = this.graphData;
    graphData = graphData.sort(function(a, b) {
      a = a['data'].map(function(val, index) {
        return val[1];
      });
      let maxValA = Math.max.apply(null, a);
      b = b['data'].map(function(val, index) {
        return val[1];
      });
      let maxValB = Math.max.apply(null, b);
      return maxValA - maxValB;
    });
    this.config = CHARTCONFIG;
    this.stackLine = {
      tooltip : {
        trigger: 'axis'
      },
      dataZoom: {
        show: true
        // zoomLock: true
        // realtime: true,
        // height: 220,
        // y: 0
        // backgroundColor: '#eee'
      },
      // click: false,
      grid: {
        left: 70,
        right: 70,
        bottom: 35,
        // top: 90
      },
      legend: {
        x: 'right',
        y: '-10',
        // backgroundColor: '#eee',
        // borderColor: 'rgba(178,34,34,0.8)',
        padding: 10,
        // itemGap: 20,
        data: [],
        textStyle: {
          color: this.config.textColor
        }
      },
      toolbox: {
        show : true,
        feature : {
          saveAsImage : {show: false, title: 'save'}
        }
      },
      calculable : false,
      xAxis : [
      {
        name: 'Time',
        type : 'category',
        boundaryGap : false,
        data: [],
        axisLabel : {
          textStyle: {
            color: this.config.textColor
          },
          formatter: function(param) {
            if(!param) return;
            let timeString = param.split(' ')[4];
            return timeString.split(':')[0] + ':' + timeString.split(':')[1];

          }
        },
        splitLine: {
          lineStyle: {
            color: this.config.splitLineColor
          }
        }
      }
      ],
      yAxis : [
      {
        // name: graphData['yAxis'],
        type : 'value',
        axisLabel : {
          textStyle: {
            color: this.config.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: this.config.splitLineColor
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: this.config.splitAreaColor
          }
        }
      }
      ],
      series : []
    };

    let legendTop = Math.round(graphData.length / 8) * 30;
    if(legendTop <= 40) {
      legendTop = 40;
    } else if(legendTop >= 100) {
      legendTop = 100;
    }
    this.stackLine.grid.top = legendTop;
    let maxDataPointLength = 0;
    for(let i = 0; i < graphData.length; i++) {
      const name = graphData[i]['name'];
      this.stackLine['legend']['data'][i] = name;
      if(this.tabperformance === 'performance'){
        this.stackLine['series'][i] = {
          name: name,
          data: [],
          type: 'line',
        };
      }
      else{
        this.stackLine['series'][i] = {
          name: name,
          data: [],
          type: 'line',
          stack: 'Sum',
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
        };
      }
      

      for(let j = 0; j < graphData[i].data.length; j++) {
        let dataPoint = graphData[i].data[j][1];
        if (dataPoint == null || isNaN(dataPoint)) {
          continue;
        }
        if(dataPoint.toFixed(0).length > maxDataPointLength) {
          maxDataPointLength = dataPoint.toFixed(0).length;
        }

        this.stackLine['series'][i]['data'].push(dataPoint);
        if(i == 0) {  
          let tempDate = this.getISTTime(graphData[i].data[j][0]);
          this.stackLine['xAxis'][0]['data'].push(tempDate);
          this.stackLine['yAxis'][0]['name'] = graphData[i]['yAxis'];
        }
      }


    }
    if(maxDataPointLength <= 3) {
      this.stackLine.grid.left = 40;    
    } else {
      this.stackLine.grid.left = 40 + (maxDataPointLength - 3) * 7;
    }

    if (graphData) {
      if (graphData.length > 0) {
        for(let i = 0; i < graphData.length; i++) {
          if (graphData[i].data.length < 1) {
            this.loadingNoData = true;
            break;    
          }
        }
      } else {
        this.loadingNoData = true;
      }
    } else {
      this.loadingNoData = true;
    }
  }

  dataZoomHandler(dataZoomEvent: any) {
    this.dataZoom.emit(dataZoomEvent);
  }

  handleMouseUp(mouseupEvent: any) {
    this.mouseUpEvent.emit(mouseupEvent);
  }

  handleMouseDown(mousedownEvent: any) {
    this.mouseDownEvent.emit(mousedownEvent);
  }  

  getISTTime(datetime) {
    let tempDate = new Date(datetime).toString();
    return tempDate.split(' GMT+0530')[0];
  }

  triggerReload() {
    this.reloadGraphData.emit(true);
  }

  displayGraph() {
    return !this.loading && !this.loadingError && !this.loadingNoData;
  }
  

}