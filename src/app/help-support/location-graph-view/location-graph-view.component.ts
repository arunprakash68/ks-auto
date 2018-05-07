import { Component, OnInit, Input } from '@angular/core';
import { CHARTCONFIG } from '../../charts/charts.config';

@Component({
  selector: 'location-graph-view',
  templateUrl: './location-graph-view.component.html',
  styleUrls: ['./location-graph-view.component.scss']
})
export class LocationGraphViewComponent implements OnInit {
  config = CHARTCONFIG;
  @Input() ageingParams: any;
  bar1 = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Total Engineer', 'Response'],
      textStyle: {
        color: this.config.textColor
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: 'save' }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['Delhi', 'Mumbai', 'Kolkata', 'Pune', 'Noida', 'Total'],
        axisLabel: {
          textStyle: {
            color: this.config.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: this.config.splitLineColor
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
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
    series: [
      {
        name: 'Total Engineer',
        type: 'bar',
        data: [15, 20, 22, 23, 34, 114],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: 'Average' }
          ]
        }
      },
      {
        name: 'Response',
        type: 'bar',
        data: [2, 3, 4, 5, 7, 21],
        // markPoint: {
        //   data: [
        //     { name: 'Highest', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
        //     { name: 'Lowest', value: 2.3, xAxis: 11, yAxis: 3 }
        //   ]
        // },
        // markLine: {
        //   data: [
        //     { type: 'average', name: 'Average' }
        //   ]
        // }
      }
    ]
  };

  bar2 = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Total'],
      textStyle: {
        color: this.config.textColor
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: 'save' }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['Total', 'LogIn', 'Inprogress', 'N.A', 'OnHold', 'Resolved'],
        axisLabel: {
          textStyle: {
            color: this.config.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: this.config.splitLineColor
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
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
    series: [
      {
        name: 'Total',
        type: 'bar',
        data: [114, 25, 24, 21, 23, 21],

      }
    ]
  };

  bar4 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Inprogress', 'On Hold', 'User not Available'],
      textStyle: {
        color: this.config.textColor
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: 'save' }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['Engineer 1', 'Engineer 2', 'Engineer 3', 'Engineer 4', 'Engineer 5', 'Engineer 6'],
        axisLabel: {
          textStyle: {
            color: this.config.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: this.config.splitLineColor
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
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
    series: [
      // {
      //   name: 'Total',
      //   type: 'bar',
      //   data: [13, 18, 16, 18, 24, 34]
      // },
      {
        name: 'Inprogress',
        type: 'bar',
        // stack: 'Sum',
        // itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data: [2, 1, 0, 1, 1, 1]
      },
      {
        name: 'On Hold',
        type: 'bar',
        // stack: 'Sum',
        // itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data: [1, 1, 0, 1, 0, 1]
      },
      {
        name: 'User not Available',
        type: 'bar',
        // stack: 'Sum',
        // itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
        data: [1, 0, 1, 0, 0, 0]
      },

    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
