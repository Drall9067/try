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

  images: Array<any> = [];

  status: string[] = ["Pending...","Pending...","Pending...","Pending..."];

  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  videoOptions: MediaTrackConstraints = { };
  webcamImage: WebcamImage = null;
  trigger: Subject<void> = new Subject<void>();
  nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
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
    // console.info('received webcam image', webcamImage);
    // console.info('received webcam image', webcamImage['imageAsBase64']);
    this.images.push(webcamImage['imageAsDataUrl']);
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

  sendImage() {
    return new Promise((resolve, reject) => {
      console.log("Sending Image...");
      this.triggerSnapshot();

      this.data_service.sendFrame(this.webcamImage['imageAsBase64'])
      .subscribe((res) => {
        console.log("Image Sent...")
        resolve('Done')
      });
    });
  }

  switchCamera() {
    return new Promise((resolve, reject) => {
      console.log("Switching Camera...");
      this.showNextWebcam(true);
      resolve('Done')
    });
  }

  async pipeline() {
    var i;
    for(i=0; i<2; i++) {
      await this.sendImage()
      .then(()=>{
        console.log("Image Sent!!!")
        this.switchCamera()
        .then(()=>{
          console.log("Camera Switched!!!")
        })
      });
    }
  }

}