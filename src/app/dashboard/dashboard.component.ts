import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import 'webrtc-adapter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  deviceList: Array<any> = ["", ""];

  @ViewChild('frontVideoElement') frontVideoElement: any;
  frontVideo: any;
  frontLocalStream: any;
  @ViewChild('rearVideoElement') rearVideoElement: any;
  rearVideo: any;
  rearLocalStream: any;

  @ViewChild('frontCanvasElement') frontCanvasElement: any;
  frontCanvas: any;
  @ViewChild('rearCanvasElement') rearCanvasElement: any;
  rearCanvas: any;

  frontImages: Array<any>;
  rearImages: Array<any>;

  status: string = "";

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.frontVideo = this.frontVideoElement.nativeElement;
    this.rearVideo = this.rearVideoElement.nativeElement;

    this.frontCanvas = this.frontCanvasElement.nativeElement;
    this.rearCanvas = this.rearCanvasElement.nativeElement;

    this.frontImages = [];
    this.rearImages = [];
  }

  initCamera() {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    if (!browser.mediaDevices || !browser.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    var frontConfig = {
      video : {
        deviceId : {
          exact : this.deviceList[0]
        }
      },
      audio : false
    }
    browser.mediaDevices.getUserMedia(frontConfig).then(stream => {
      this.frontLocalStream = stream;
      this.frontVideo.srcObject = stream;
      this.frontVideo.play();
    })
    .catch((err) => {
      console.log(err)
    });

    var rearConfig = {
      video : {
        deviceId : {
          exact : this.deviceList[1]
        }
      },
      audio : false
    }
    browser.mediaDevices.getUserMedia(rearConfig)
    .then(stream => {
      this.rearLocalStream = stream;
      this.rearVideo.srcObject = stream;
      this.rearVideo.play();
    })
    .catch((err) => {
      console.log(err)
    });
  }

  start() {
    this.initCamera();
  }

  stop() {
    if (this.frontLocalStream) {
      this.frontVideo.pause();
      this.frontLocalStream.getTracks()[0].stop();
    }
    if (this.rearLocalStream) {
      this.rearVideo.pause();
      this.rearLocalStream.getTracks()[0].stop();
    }
  }

  capture() {
    var context = this.frontCanvas.getContext('2d').drawImage(this.frontVideo,0,0,200,300);
    this.frontImages.push(this.frontCanvas.toDataURL());
    // console.log(this.frontCanvas.toDataURL());

    var context = this.rearCanvas.getContext('2d').drawImage(this.rearVideo,0,0,200,300);
    this.rearImages.push(this.rearCanvas.toDataURL());
    // console.log(this.rearCanvas.toDataURL());

    var frontData = this.frontCanvas.toDataURL();
    var rearData = this.rearCanvas.toDataURL();

    this.data_service.sendFrame(frontData, rearData).subscribe((res) =>{
      console.log("In subscribe")
      console.log(res)
      console.log("Out subscribe")
      this.status = res['message']
    });
  }

  getDevices() {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    if (!browser.mediaDevices || !browser.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    var i = 0;
    return browser.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if(device['kind'] === "videoinput") {
          console.log(device)
          this.deviceList[i] = device['deviceId'];
          i++;
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

}