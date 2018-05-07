import { Component, OnInit, Input } from '@angular/core';
import { CHARTCONFIG } from '../../charts/charts.config';

@Component({
  selector: 'engineer-graph-view',
  templateUrl: './engineer-graph-view.component.html',
  styleUrls: ['./engineer-graph-view.component.scss']
})
export class EngineerGraphViewComponent implements OnInit {
  @Input() ageingParams: any;
  config = CHARTCONFIG;
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
  constructor() { }

  ngOnInit() {
  }

}
