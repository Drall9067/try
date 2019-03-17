import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendFrame(frame) {
    return this.http.post('api/image', { 'frame' : frame }).pipe(
      map((res) => {
        return res
      })
    );
  }
}
