import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any;
  dataName: any;

  @ViewChild('videoElement') videoElement: any;
  video: any;
  localStream: any;

  @ViewChild('canvasElement') canvasElement: any;
  canvas: any;

  imageData: Array<any>;

  status: string = "";

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;
    this.imageData = [];

    this.data_service.getStore().subscribe((res) => {
      console.log(res);
      this.data = res['stores'];
    });

    this.data_service.getStoreName('My Wonderful Store').subscribe((res) => {
      console.log(res);
      this.dataName = res['items'];
    });
  }

  initCamera(config:any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.localStream = stream;
      this.video.srcObject = stream;
      if(config['video']) {
        this.video.play();
      }
      else {
        this.video.stop();
      }
    });
  }

  start() {
    this.initCamera({ video: true, audio: false });
  }

  stop() {
    if (this.localStream) {
      this.video.pause();
      this.localStream.getTracks()[0].stop();
    }
  }

  capture() {
    var context = this.canvas.getContext('2d').drawImage(this.video,0,0,200,200);
    this.imageData.push(this.canvas.toDataURL());
    console.log(this.canvas.toDataURL());

    var data = this.canvas.toDataURL();

    this.data_service.sendFrame(data).subscribe((res) =>{
        console.log("In subscribe")
        console.log(res)
        console.log("Out subscribe")
        this.status = res['message']
    });
  }

}
