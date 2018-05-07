import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'keystone-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() height: any=70;
  @Input() width: any=70;

  constructor() { }

  ngOnInit() {
  }

}
