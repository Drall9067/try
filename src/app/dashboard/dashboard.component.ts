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

  storeData: any;
  storeName: any;
  images: Array<any> = [];

  status: string[] = ["Pending...","Pending...","Pending...","Pending..."];

  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  // latest snapshot
  webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });

    this.data_service.getStore().subscribe((res) => {
      console.log(res);
      this.storeData = res['stores'];
    });

    this.data_service.getStoreName('My Wonderful Store').subscribe((res) => {
      console.log(res);
      this.storeName = res['items'];
    });
  }

  triggerSnapshot() {
    this.trigger.next();
  }

  toggleWebcam() {
    this.showWebcam = !this.showWebcam;
  }

  showNextWebcam(directionOrDeviceId: boolean|string) {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    console.info('received webcam image', webcamImage);
    // console.info('received webcam image', webcamImage['imageAsBase64']);
    this.webcamImage = webcamImage;
  }

  cameraWasSwitched(deviceId: string) {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  pipeline() {
    var i=0,j=0;
    for(i=0;i<4;i++){
      this.triggerSnapshot();
      // console.log(this.webcamImage['imageAsBase64']);
      this.images.push(this.webcamImage['imageAsDataUrl']);

      this.data_service.sendFrame(this.webcamImage['imageAsBase64']).subscribe((res)=>{
        console.log("Done!");
        this.status[j]=res['message'];
        j++;
        this.showNextWebcam(true);
      });
    }
  }

}
