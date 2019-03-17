import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  localURL: string = 'http://localhost:5000/'

  constructor(private http: HttpClient) { }

  sendOneFrame(front) {
    return this.http.post(this.localURL+'api/image', { 'front' : front}).pipe(
    // return this.http.post('api/oneImage', { 'front' : front }).pipe(
      map((res) => {
        console.log("In pipe")
        console.log(res)
        console.log("Out pipe")
        return res
      })
    );
  }

  sendTwoFrame(front,rear) {
    return this.http.post(this.localURL+'api/image', { 'front' : front, 'rear' : rear }).pipe(
    // return this.http.post('api/twoImage', { 'front' : front, 'rear' : rear }).pipe(
      map((res) => {
        console.log("In pipe")
        console.log(res)
        console.log("Out pipe")
        return res
      })
    );
  }
}
