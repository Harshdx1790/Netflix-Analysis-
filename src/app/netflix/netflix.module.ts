import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis/analysis.component';
import {AnalysisService} from './analysis/analysis.service';
import {SearchService} from './search/search.service';
import {HttpClientModule} from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
import { Chart1Component } from './analysis/chart1/chart1.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {NetflixRoutingModule} from './netflix-routing.module';
import { SearchComponent } from './search/search.component';
import { WorldMapComponent } from './analysis/world-map/world-map.component'
import {MatSliderModule} from '@angular/material/slider';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AnalysisComponent,
    Chart1Component,
    SearchComponent,
    WorldMapComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    NetflixRoutingModule,
    MatSliderModule
  ],
  exports:[
    AnalysisComponent,
    Chart1Component,
    WorldMapComponent
  ],
  providers:[AnalysisService,SearchService]
})
export class NetflixModule { }
