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
    return this.http.get(this.localURL+'api/stores');
  }

  getStoreName(data) {
    return this.http.get(this.localURL+`api/stores/${data}`);
  }

  sendFrame(data) {
    return this.http.post(this.localURL+'api/image', { 'imageAsBase64' : data }).pipe(
      map((res) => {
        console.log("In pipe")
        console.log(res)
        console.log("Out pipe")
        return res
      })
    );
  }
}
