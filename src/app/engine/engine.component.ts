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
  imagesData : Array<any> = [];

  status: string = "";
  mood: string = "";

  showWebcam = true;
  allowCameraSwitch = false;
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
  allowSend: boolean;

  songAudioURL: string;
  songAudio: any;
  alertAudioURL: string;
  alertAudio: any;

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.mlEngine = false;
    this.functionality = "Detecting Drowsiness and Expressions";
    this.frontCamera = true;
    this.alertAudioURL = 'https://vocaroo.com/media_command.php?media=s12Jk2MplTcB&command=download_mp3'
    this.alertAudio = new Audio(this.alertAudioURL);
  }

  ngOnDestroy() {
    if(this.songAudio) {
      this.songAudio.pause();
    }
    if(this.alertAudio) {
      this.alertAudio.pause();
    }
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
      this.functionality = "Detecting Drowsiness and Expressions";
      if (this.songAudio) {
        this.songAudio.pause();
      }
    }
    else {
      this.functionality = "Detecting Vehicles and Persons"
    }
    this.nextWebcam.next(directionOrDeviceId);
  }
  handleImage(webcamImage: WebcamImage) {
    // console.info('received webcam image', webcamImage);
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

  emotionDetection() {
    return new Promise((resolve, reject) => {
      console.log("Sending Emotion Image...");
      this.triggerSnapshot();

      this.data_service.sendEmotionFrame(this.webcamImage['imageAsBase64'])
        .subscribe((res) => {
          this.songAudioURL = res['url'];
          this.mood = res['mood'];
          this.startSongAudio();
          console.log("Emotion Image Sent");
          resolve('Done');
        });
    });
  }

  async emotionDetectionPipeline() {
    await this.emotionDetection();
  }

  shutter() {
    return new Promise((resolve,reject) => {
      this.triggerSnapshot();
      resolve('Done');  
    });
  }

  captureBacthHandler() {
    return new Promise((resolve,reject) => {
      var i;
      for(i=0; i<20; i++) {
        this.shutter()
        .then(() => {
          console.log(i);
          this.images.push(this.webcamImage['imageAsDataUrl']);
          this.imagesData.push(this.webcamImage['imageAsBase64']);
        });
      }
      resolve('Done');
    });
  }

  captureBatch() {
    return new Promise((resolve,reject) => {
      this.shutter()
      .then(()=>{
        this.imagesData.push(this.webcamImage['imageAsBase64']);
        this.images.push(this.webcamImage['imageAsDataUrl']);
      })
      .then(()=>{
        resolve('Done');
      });
    });
  }

  sendFrontImage() {
    return new Promise((resolve, reject) => {
      console.log("Capturing Images...");
      
      this.captureBatch()
      .then(()=>{
        if(this.imagesData.length<5) {
          resolve('Done')
        }
        else {
          console.log("Sending Images...");
          console.log(this.imagesData.length);
          this.data_service.sendFrontFrame(this.imagesData)
          .subscribe((res) => {
            if(res['message']=='1') {
              this.status = "DANGER!";
              this.startAlertAudio();
            }
            else {
              this.status = "No Danger";
            }
            this.images = [];
            this.imagesData = [];
            console.log("Front Images Sent");
            resolve('Done');
          });
        }
      });
    });
  }

  sendRearImage() {
    return new Promise((resolve, reject) => {
      console.log("Sending Image...");
      this.triggerSnapshot();
      this.images = []
      this.images.push(this.webcamImage['imageAsDataUrl']);

      this.data_service.sendRearFrame(this.webcamImage['imageAsBase64'])
      .subscribe((res) => {
        if(res) {
          this.status = "DANGER!"
          this.startAlertAudio()
        }
        else {
          this.status = "No Danger"
        }
        console.log("Rear Image Sent");
        resolve('Done');
      });
    });
  }

  async startPipeline() {
    this.stopPipeline();

    if (this.frontCamera) {
      this.images = []
      this.imagesData = []
      await this.emotionDetectionPipeline();
      this.mlEngine = true;
      this.timer = setInterval(async ()=>{
        if (this.allowSend) {
          this.allowSend = false;
          await this.sendFrontImage()
          .then(()=>{
            this.allowSend = true
          });
        }
      },100);
    }
    else {
      this.mlEngine = true;
      this.timer = setInterval(async ()=>{
        if (this.allowSend) {
          this.allowSend = false;
          await this.sendRearImage()
          .then(()=>{
            this.allowSend = true
          });
        }
      },100);
    }
  }

  stopPipeline() {
    this.mlEngine = false;
    this.allowSend = true;
    this.mood = "";
    clearInterval(this.timer);
    if(this.songAudio) {
      this.songAudio.pause();
    }
    if(this.alertAudio) {
      this.alertAudio.pause();
    }
    this.status = "";
  }

  startSongAudio() {
    if(this.songAudio) {
      this.songAudio.pause();
    }
    this.songAudio = new Audio(this.songAudioURL);
    this.songAudio.onended = () => {
      if (this.frontCamera) {
        console.log("Done");
        this.startPipeline();
      }
    }
    this.songAudio.play();
  }

  startAlertAudio() {
    this.alertAudio.play();
  }

}
