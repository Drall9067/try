import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit {

  

  images: Array<any> = [];

  status: string;

  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  videoOptions: MediaTrackConstraints = { };
  webcamImage: WebcamImage = null;
  trigger: Subject<void> = new Subject<void>();
  nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  mlEngine: boolean;
  timer: any;
  functionality: string;
  frontCamera: boolean;

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.status = "";
    this.mlEngine = false;
    this.functionality = "Detecting Drowsiness and Expressions";
    this.frontCamera = true;
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
    this.frontCamera = !this.frontCamera;
    if(this.frontCamera) {
      this.functionality = "Detecting Drowsiness and Expressions"
    }
    else {
      this.functionality = "Detecting Vehicles and Persons"
    }
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

      if(this.frontCamera) {
        this.data_service.sendFrontFrame(this.webcamImage['imageAsBase64'])
        .subscribe((res) => {
          this.status = res['message'];
          console.log("Front Image Sent");
          resolve('Done');
        });
      }
      else {
        this.data_service.sendRearFrame(this.webcamImage['imageAsBase64'])
        .subscribe((res) => {
          this.status = res['message'];
          console.log("Rear Image Sent");
          resolve('Done');
        });
      }
      
    });
  }

  startPipeline() {
    this.mlEngine = true;
    this.timer = setInterval(async ()=>{
      await this.sendImage();
    },100);
  }

  stopPipeline() {
    this.mlEngine = false;
    clearInterval(this.timer);
    this.status = "";
  }

}
