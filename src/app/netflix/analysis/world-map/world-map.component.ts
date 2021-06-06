import { group } from '@angular/animations';
import { Component, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements AfterViewInit {
  @Input() chartData: any = {};
  @Input() chartMeta: any = {};
  public name: string = 'd3';
  private tooltip: any;
  public start_year = 0;
  public end_year = 0;
  public ticks = 0;
  public selected_year = 0
  public filtered_data: any = [];
  public previous_data:any;

  public last_5_year_movie:any;
  public last_5_year_show:any;
  public change_percent_5_year_movie:any;
  public change_percent_5_year_show:any;

  public ComparisonAnalysis:any
  constructor() { }

  ngAfterViewInit() {

    let lookup: any = {};
    let items = this.chartData;
    let release_year = [];

    for (let item, i = 0; item = items[i++];) {
      let name: any = item.release_year;

      if (!(name in lookup)) {
        lookup[name] = 1;
        release_year.push(name);
      }
    }
    release_year.sort((a: any, b: any) => a - b)
    this.start_year = release_year[0]
    this.end_year = release_year[release_year.length - 1];
    this.comparisonAnalysis(this.end_year)
    this.selected_year = release_year[0]
    this.filtered_data = this.filterDataByYear(this.chartData, this.start_year)

    d3.json("../../../../assets/json/first20_med_a2.json")
      .then((data) => {

        this.setMap(this.chartMeta.width, this.chartMeta.height, data, this.filtered_data)
      })


  }
  public filterDataByYear(data: any, year: any) {
    return data.filter((element: any) => element.release_year == year)
  }

  formatLabel(value: number) {
    this.selected_year = value

    return value

  }
  sliderOnChange(value: any) {
    this.selected_year = value
    this.filtered_data = this.filterDataByYear(this.chartData, value)
    this.comparisonAnalysis(this.selected_year)
    d3.json("../../../../assets/json/first20_med_a2.json")
      .then((data) => {

        this.setMap(this.chartMeta.width, this.chartMeta.height, data, this.filtered_data)
      })

  }

  


  comparisonAnalysis(selected_year:any){
    this.previous_data = this.filterDataByYear(this.chartData, (selected_year-1))
    let previous_5_year_data = this.filterDataByYear(this.chartData, 2015)
    this.last_5_year_movie = previous_5_year_data.filter((element: any) => element.type == "Movie").length;
    this.last_5_year_show = previous_5_year_data.filter((element: any) => element.type == "TV Show").length;
   
    let current_data_for_5_year = this.filterDataByYear(this.chartData, 2020)
    
    let current_data_for_5_year_movie = current_data_for_5_year.filter((element: any) => element.type == "Movie").length
    let current_data_for_5_year_show = current_data_for_5_year.filter((element: any) => element.type == "TV Show").length
    this.change_percent_5_year_movie = ((current_data_for_5_year_movie - this.last_5_year_movie)/this.last_5_year_movie)*100
    this.change_percent_5_year_show = ((current_data_for_5_year_show - this.last_5_year_show)/this.last_5_year_show)*100

    console.log((this.change_percent_5_year_movie-this.change_percent_5_year_show)/this.change_percent_5_year_show )
    let retun_change_perc:any = (((this.change_percent_5_year_movie-this.change_percent_5_year_show)/this.change_percent_5_year_show )*100).toFixed(2)
    
      this.ComparisonAnalysis = "Rate of change of % for Tv shows has been increased by "+Math.abs(retun_change_perc)+"%  compare to Movies in the past 5 Year Analysis "
    
  }


  setMap(width: any, height: any, dataset: any, groupedData: any) {


    const color_legend = d3.scaleThreshold<string, string>()
      // .range(d3.schemeCategory10)
      .range([ "#FF3366",'#03C04A', '#FF4500', '#131313'])
      .domain(["empty", "Movie", "TV Show", "Both"]);

    const margin = { top: 10, right: 30, bottom: 10, left: 30 };
    width = width;
    height = height - margin.top - margin.bottom;

    const tooltipDiv = d3.select("body").append('div')
      .attr('class', 'd3-tip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style("max-width","300px")

      ;

    const projection = d3.geoMercator()
      .rotate([-11, 0])
      .scale(1)
      .translate([0, 0]);
    const path: any = d3.geoPath().projection(projection);
    d3.select("svg").remove();
    const svg = d3.select('#world-map')
      .append('svg')
      .attr("id", "chartId")
      .attr('width', width)
      .attr('height', height)
      // .style('margin', 'auto')
      .style('display', 'flex');

    const b = path.bounds(dataset),
      s = .90 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t: any = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(s).translate(t);
    var pathLabel = svg.selectAll('path')
      .data(dataset.features)
      
      .enter()
      .append('path')
      .attr('d', path)
      .style("stroke",(d:any) => {
        var colour = ""
        if(d.properties.name!="Bermuda"){
          colour = "aqua";
        }
       return colour;
      } )
      .style('fill', (d: any) => {
        
        let return_value = ""
        let localMovieCounter = 0;
        let localShowCounter = 0;

        for (var i in groupedData) {
         
          if (groupedData[i].country && d.properties.name!="Bermuda" && (groupedData[i].country.includes(d.properties.name) || d.properties.name.includes(groupedData[i].country))) {
           
            if (groupedData[i].type == "Movie") {
              localMovieCounter++
            } if (groupedData[i].type == "TV Show") {
              localShowCounter++
            }
            if (localMovieCounter == 0 && localShowCounter == 0) {
             
              if(groupedData[i].type =="Movie"){
                return_value = "#03C04A"
              }else{
                return_value = "#FF4500"
              }
             
            } else if ((localMovieCounter > 0 && localShowCounter == 0 && groupedData[i].type == "Movie") || (localMovieCounter == 0 && localShowCounter > 0 && groupedData[i].type == "TV Show")) {
             
              if(groupedData[i].type =="Movie"){
                return_value = "#03C04A"
              }else{
                return_value = "#FF4500"
              }
              
            } else {
              return_value = "#FF3366"
             return return_value
            }
           
          }else{
           
            return_value = "#131313"
          }
        }
       
       if(localMovieCounter >0){
        return "#03C04A";
       }if(localShowCounter>0){
        return "#FF4500";
       }
        return return_value;
      });
    pathLabel.transition()
      .delay(100)
      .duration(1000);
    pathLabel.on('mouseover', (event: any, d: any) => {
      let tooltipData = "";
      let movieCounter = [];
      let showCounter = [];
      let previousmovieCounter = [];
      let previousshowCounter = [];
      for(var j in this.previous_data){
        if (this.previous_data[j].country && (this.previous_data[j].country.includes(d.properties.name) || d.properties.name.includes(this.previous_data[j].country))) {
          if (this.previous_data[j].type == "Movie") {
            previousmovieCounter.push(this.previous_data[j].title)
          } if (this.previous_data[j].type == "TV Show") {
            previousshowCounter.push(this.previous_data[j].title)
          }
        }
      }
      for (var i in groupedData) {
        if (groupedData[i].country && (groupedData[i].country.includes(d.properties.name) || d.properties.name.includes(groupedData[i].country))) {

          //  color_legend(groupedData[i].type)
          if (groupedData[i].type == "Movie") {
            movieCounter.push(groupedData[i].title)
          } if (groupedData[i].type == "TV Show") {
            showCounter.push(groupedData[i].title)
          }

        }
      }
      tooltipData += "<div class='tooltip-tile'>  " + d.properties.name + " in " + this.selected_year + " </div><br />"
      if(this.selected_year!=1925){
        if( movieCounter.length>previousmovieCounter.length){
          tooltipData += "<div class='tooltip-arrow-div'> <span class='tooltip-subtitle'> No. of Movies: </span> <span class='tooltip-subtitle-value'> " + movieCounter.length + " </span><p class='arrow-up'></p><span class='tooltip-ytd'> ( "+previousmovieCounter.length+" in "+(this.selected_year-1)+" )</span></div>"
        }else{
          tooltipData += "<div class='tooltip-arrow-div'> <span class='tooltip-subtitle'> No. of Movies: </span> <span class='tooltip-subtitle-value'> " + movieCounter.length + " </span><p class='arrow-down'></p><span class='tooltip-ytd'> ( "+previousmovieCounter.length+" in "+(this.selected_year-1)+" )</span></div>"
        }
        if( showCounter.length>previousshowCounter.length){
          tooltipData += "<div class='tooltip-arrow-div'> <span class='tooltip-subtitle'> No. of Tv Shows: </span> <span class='tooltip-subtitle-value'> " + showCounter.length + " </span><p class='arrow-up'></p><span class='tooltip-ytd'> ( "+previousshowCounter.length+" in "+(this.selected_year-1)+" )</span></div>"
        }else{
          tooltipData += "<div class='tooltip-arrow-div'> <span class='tooltip-subtitle'> No. of Tv Shows: </span> <span class='tooltip-subtitle-value'> " + showCounter.length + " </span><p class='arrow-down'></p><span class='tooltip-ytd'> ( "+previousshowCounter.length+" in "+(this.selected_year-1)+" )</span></div>"
        }
         
        
       
      }
     
      tooltipData += "<div class=''><span class='tooltip-subtitle'>Movies Published  : </span>"
      for (var i in movieCounter) {
        if(movieCounter[i].toString().length>15){
          tooltipData += " <span class='tooltip-subtitle-movies'>" + movieCounter[i].toString().substring(0,15) + ".., </span> "
        }else{
          tooltipData += " <span class='tooltip-subtitle-movies'>" + movieCounter[i].toString() + ", </span> "
        }
        
      }
      tooltipData += "</div>"
      tooltipData += "<div class=''><span class='tooltip-subtitle'>Tv Shows Published  : "
      for (var i in showCounter) {
        if(showCounter[i].toString().length>15){
          tooltipData += " <span class='tooltip-subtitle-movies'>" + showCounter[i].toString().substring(0,15) + "..</span>, "
        }else{
          tooltipData += " <span class='tooltip-subtitle-movies'>" + showCounter[i] + "</span>, "
        }
       
      }
      tooltipData += "</div>"
   
      tooltipDiv.transition()
        .duration(200)
        .style('opacity', .9);
 if(d.properties.name!="Bermuda"){
      tooltipDiv.html(tooltipData)
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      }else{
        tooltipDiv.transition()
        .duration(500)
        .style('opacity', 0);
      }
    })
      .on('mouseout', (d) => {
        tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0);
      })


  }


}
