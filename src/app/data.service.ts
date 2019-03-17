import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendFrame(front,rear) {
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
