import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getStore() {
    return this.http.get('api/stores');
  }

  getStoreName(data) {
    return this.http.get(`api/stores/${data}`);
  }
}
