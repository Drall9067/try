import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getStore() {
    return this.http.get('http://localhost:5000/api/stores');
  }

  getStoreName(data) {
    return this.http.get(`http://localhost:5000/api/stores/${data}`);
  }
}
