import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  sendFrame(data) {
    return this.http.post('/api/image', { 'imageBase64' : data }).pipe(
      map((res) => {
        console.log("In pipe")
        console.log(res)
        console.log("Out pipe")
        return res
      })
    );
  }
}
