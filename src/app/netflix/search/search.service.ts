import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private REST_API_SERVER = "/assets/netflix.json"
  constructor(private httpClient: HttpClient) { }

  fetchNetflixData(){
    return this.httpClient.get(this.REST_API_SERVER)
  }
}
