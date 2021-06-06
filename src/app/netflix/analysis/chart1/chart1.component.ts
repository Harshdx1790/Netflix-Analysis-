import { Component,Input, AfterContentInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3'
import * as chord from "d3-chord";
@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements AfterViewInit {
  @Input() chartData:any = {};
  @Input() chartMeta:any = {};
 

  

  constructor() { }

  ngAfterViewInit(): void {
  
    
  }

}
