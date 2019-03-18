import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendFrontFrame(image) {
    return this.http.post('api/frontImage', { 'image' : image }).pipe(
      map((res) => {
        return res
      })
    );
  }

  sendRearFrame(image) {
    return this.http.post('api/rearImage', { 'image' : image }).pipe(
      map((res) => {
        return res
      })
    );
  }
}
