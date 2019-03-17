import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  images1: Array<any> = [];
  images2: Array<any> = [];

  status: string[] = ["Pending...","Pending...","Pending...","Pending..."];

  showWebcam1 = true;
  allowCameraSwitch1 = true;
  multipleWebcamsAvailable1 = false;
  deviceId1: string;
  videoOptions1: MediaTrackConstraints = { };
  webcamImage1: WebcamImage = null;
  trigger1: Subject<void> = new Subject<void>();
  nextWebcam1: Subject<boolean|string> = new Subject<boolean|string>();

  showWebcam2 = true;
  allowCameraSwitch2 = true;
  multipleWebcamsAvailable2 = false;
  deviceId2: string;
  videoOptions2: MediaTrackConstraints = { };
  webcamImage2: WebcamImage = null;
  trigger2: Subject<void> = new Subject<void>();
  nextWebcam2: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable1 = mediaDevices && mediaDevices.length > 1;
        this.multipleWebcamsAvailable2 = mediaDevices && mediaDevices.length > 1;
        this.showNextWebcam2(true);
      });
  }

  triggerSnapshot1() {
    this.trigger1.next();
  }
  toggleWebcam1() {
    this.showWebcam1 = !this.showWebcam1;
  }
  showNextWebcam1(directionOrDeviceId: boolean|string) {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam1.next(directionOrDeviceId);
  }
  handleImage1(webcamImage: WebcamImage) {
    console.info('received webcam image', webcamImage);
    // console.info('received webcam image', webcamImage['imageAsBase64']);
    this.images1.push(webcamImage['imageAsDataUrl']);
    this.webcamImage1 = webcamImage;
  }
  cameraWasSwitched1(deviceId: string) {
    console.log('active device: ' + deviceId);
    this.deviceId1 = deviceId;
  }
  get triggerObservable1(): Observable<void> {
    return this.trigger1.asObservable();
  }
  get nextWebcamObservable1(): Observable<boolean|string> {
    return this.nextWebcam1.asObservable();
  }

  triggerSnapshot2() {
    this.trigger2.next();
  }
  toggleWebcam2() {
    this.showWebcam2 = !this.showWebcam2;
  }
  showNextWebcam2(directionOrDeviceId: boolean|string) {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam2.next(directionOrDeviceId);
  }
  handleImage2(webcamImage: WebcamImage) {
    console.info('received webcam image', webcamImage);
    // console.info('received webcam image', webcamImage['imageAsBase64']);
    this.images2.push(webcamImage['imageAsDataUrl']);
    this.webcamImage2 = webcamImage;
  }
  cameraWasSwitched2(deviceId: string) {
    console.log('active device: ' + deviceId);
    this.deviceId2 = deviceId;
  }
  get triggerObservable2(): Observable<void> {
    return this.trigger2.asObservable();
  }
  get nextWebcamObservable2(): Observable<boolean|string> {
    return this.nextWebcam2.asObservable();
  }


  pipeline() {
    var i;
    for(i=0; i<4; i++){
      this.triggerSnapshot1();
      this.triggerSnapshot2();

      this.data_service.sendFrame(this.webcamImage1['imageAsBase64'], this.webcamImage2['imageAsBase64'])
      .subscribe((res) => {
        console.log("Done");
        console.log(i);
        this.status[i] = res['message'];
      });
    }
  }

}