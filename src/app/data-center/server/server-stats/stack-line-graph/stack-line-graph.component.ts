import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CHARTCONFIG } from './charts.config';


export interface LineGraphDataModel {
	name: string;
	data: any[];
}

@Component({
  selector: 'server-stack-line-graph',
  styles: [],
  providers: [],
  templateUrl: './stack-line-graph.component.html'
})

export class ServerStackLineGraphComponent {
  @Input() graphData: any[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() loadingNoData: boolean;
  @Input() callResize: boolean;
  @Input() chartOptions: any;
  @Output() reloadGraphData: EventEmitter<boolean> = new EventEmitter<boolean>();
  stackLine: any;
  config: any;

  ngOnChanges() {
    this.loadingNoData = false;
    if (this.loading) {
      return;
    }
    let graphData = this.graphData;

    let minData = graphData[0]['data'].map(function(val, index) {
      return val[1];
    });
    let minValData = Math.min.apply(null, minData);

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
        show:this.chartOptions.tooltip.show,
        trigger: 'axis'
      },
      grid: {
        left: this.chartOptions.grid.left || 70,
        right: this.chartOptions.grid.right || 70,
        bottom: this.chartOptions.grid.bottom || 35,
        // top: 90
      },
      legend: {
        show:this.chartOptions.legend.show,
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
        show : this.chartOptions.toolbox.show,
        feature : {
          saveAsImage : {show: false, title: 'save'}
        }
      },
      calculable : true,
      xAxis : [
      {
        show : this.chartOptions.xAxisShow,
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
            let timeString = param.split(' ')[3];
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
        // name: 'Value',
        min : this.chartOptions.isMinData ? minValData : null,
        show : this.chartOptions.yAxisShow,
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
    this.stackLine.grid.top = this.chartOptions.grid.top || legendTop;
    let maxDataPointLength = 0;
    for(let i = 0; i < graphData.length; i++) {
      const name = graphData[i]['name'];
      this.stackLine['legend']['data'][i] = name;
      this.stackLine['series'][i] = {
        name: name,
        data: [],
        type: 'line'
        // stack: 'Sum'
      };
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
          let tempDate = new Date(graphData[i].data[j][0]).toUTCString();
          let tempDateSplit = tempDate.split(', ');
          let time = new Date(graphData[i].data[j][0]).toTimeString();
          let timeSplit = time.split(':');
          // this.stackLine['xAxis'][0]['data'].push(timeSplit[0] + ':' + timeSplit[1]);
          this.stackLine['xAxis'][0]['data'].push(tempDateSplit[1].split(' GMT')[0]);
        }
      }

    }
    if(!this.chartOptions.grid.left){
      if(maxDataPointLength <= 3) {
        this.stackLine.grid.left = 40;    
      } else {
        this.stackLine.grid.left = 40 + (maxDataPointLength - 3) * 7;
      }
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

  triggerReload() {
    this.reloadGraphData.emit(true);
  }

  displayGraph() {
    return !this.loading && !this.loadingError && !this.loadingNoData;
  }
  

}