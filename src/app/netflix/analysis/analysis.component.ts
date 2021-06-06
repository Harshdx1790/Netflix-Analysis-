import { Component, AfterViewInit ,ElementRef,ViewChild,ChangeDetectorRef, OnInit } from '@angular/core';
import {AnalysisService} from './analysis.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements AfterViewInit  {
  chartData = {
    netflix_titles:[ 
    ]
  };
  chartMeta = {
    width:0,
    height:0,
  };
  @ViewChild('myIdentifier') myIdentifier: any = ElementRef;
  
  constructor(private analysisService: AnalysisService,private cd: ChangeDetectorRef) { 
   
  }
  
  ngAfterViewInit() {
   
    this.chartMeta.width = this.myIdentifier.nativeElement.offsetWidth;
    this.chartMeta.height = this.myIdentifier.nativeElement.offsetHeight;
    
  this.analysisService.fetchNetflixData().subscribe((data:any)=>{
    this.chartData = data
    console.log("this.chartData")
    console.log(this.chartData)
    this.cd.detectChanges();
  
   
  });
  


 }
  isEmptyObject(obj:any) {
   
    return (obj && (Object.keys(obj).length > 0));
  }

  
  
}
