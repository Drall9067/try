import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  localURL: string = 'http://localhost:5000/'

  constructor(private http: HttpClient) { }

  getStore() {
    // return this.http.get(this.localURL+'api/stores');
    return this.http.get('api/stores');
  }

  getStoreName(data) {
    // return this.http.get(this.localURL+`api/stores/${data}`);
    return this.http.get(`api/stores/${data}`);
  }

  sendFrame(front,rear) {
    // return this.http.post(this.localURL+'api/image', { 'front' : front, 'rear' : rear }).pipe(
    return this.http.post('api/image', { 'front' : front, 'rear' : rear }).pipe(
      map((res) => {
        console.log("In pipe")
        console.log(res)
        console.log("Out pipe")
        return res
      })
    );
  }
}
