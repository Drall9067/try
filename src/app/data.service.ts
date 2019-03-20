import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUser: any;

  constructor(private http: HttpClient) { }

  checkUser(data) {
    return this.http.post('api/checkUser', { 'user' : data }).pipe(
      map((res) => {
        if(res['user']=='') {
          return false
        }
        this.currentUser = data;
        return true
      })
    );
  }

  addUser(data) {
    return this.http.post('api/addUser', { 'user' : data }).pipe(
      map((res) => {
        if(res['user']=='') {
          return false
        }
        this.currentUser = data;
        return true
      })
    );
  }

  sendEmotionFrame(image) {
    return this.http.post('api/emotionImage', { 'image' : image }).pipe(
      map((res) => {
        return res
      })
    );
  }

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
        if (res['message']=='1') {
          return true
        }
        return false
      })
    );
  }
}
