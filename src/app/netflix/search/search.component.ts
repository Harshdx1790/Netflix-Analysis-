import { Component, AfterViewInit ,ElementRef,ViewChild,ChangeDetectorRef, OnInit  } from '@angular/core';
import {SearchService} from './search.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit {
  public CustomHeader : any = "Top Picks For You "
  public CustomSearch:any = ""
  public mainData = {
    netflix_titles:[ {
      show_id: 0,
      type: "",
      title: "",
      director: "",
      cast: "",
      country: "",
      date_added: "",
      release_year: "",
      rating: "",
      duration: "",
      listed_in:"",
      description: ""
    }
    ]
  };
  chartData = {
    netflix_titles:[ {
      show_id: 0,
      type: "",
      title: "",
      director: "",
      cast: "",
      country: "",
      date_added: "",
      release_year: "",
      rating: "",
      duration: "",
      listed_in:"",
      description: ""
    }
    ]
  };
  chartMeta = {
    width:0,
    height:0,
  };
  // @ViewChild('myIdentifier') myIdentifier: any = ElementRef;
  
  constructor(private analysisService: SearchService,private cd: ChangeDetectorRef) { 
   
  }
  
  ngAfterViewInit() {
   
    // this.chartMeta.width = this.myIdentifier.nativeElement.offsetWidth;
    // this.chartMeta.height = this.myIdentifier.nativeElement.offsetHeight;
    
  this.analysisService.fetchNetflixData().subscribe((data:any)=>{
    this.mainData = data
    this.chartData = data
    this.cd.detectChanges();
  
   
  });
  


 }
  isEmptyObject(obj:any) {
    return (obj && (Object.keys(obj).length > 0));
  }

  searchMovie(event:any){
    let localData:any = [];
    let localFullData:any = [];
    
    this.analysisService.fetchNetflixData().subscribe((data:any)=>{
      this.mainData = data 
    })
    this.mainData.netflix_titles.map(function(element,index){
      if((element.title ? element.title.toString().toLowerCase().includes(event.target.value.toString().toLowerCase()) : false) || (element.director ? element.director.toLowerCase().includes(event.target.value.toLowerCase()):false) || (element.cast ? element.cast.toLowerCase().includes(event.target.value.toLowerCase()): false)){
        localData.push(element)
      }
      localFullData.push(element)
    })
   this.chartData.netflix_titles = []
    this.chartData.netflix_titles = localData
    if(this.chartData.netflix_titles.length===this.mainData.netflix_titles.length){
      this.CustomHeader = "Top Picks For You "
      this.CustomSearch = ""
    }else{
      this.CustomHeader = "Relevant Watch"
      this.CustomSearch = this.chartData.netflix_titles.length+" found for '"+event.target.value+"'"
    }
    this.cd.detectChanges();
    
  }
}
