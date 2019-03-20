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

  status: string = "";

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
    this.songAudio.pause();
    this.alertAudio.pause();
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

  emotionDetection() {
    return new Promise((resolve, reject) => {
      console.log("Sending Emotion Image...");
      this.triggerSnapshot();

      this.data_service.sendEmotionFrame(this.webcamImage['imageAsBase64'])
        .subscribe((res) => {
          this.status = res['message'];
          console.log("Emotion Image Sent");
          resolve('Done');
        });
    });
  }

  sendImage() {
    return new Promise((resolve, reject) => {
      console.log("Sending Image...");
      this.triggerSnapshot();

      if(this.frontCamera) {
        this.data_service.sendFrontFrame(this.webcamImage['imageAsBase64'])
        .subscribe((res) => {
          if(res) {
            this.status = "DANGER!"
            this.startAlertAudio()
          }
          else {
            this.status = "No Danger"
          }
          console.log("Front Image Sent");
          resolve('Done');
        });
      }
      else {
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
      }
    });
  }

  async emotionDetectionPipeline() {
    await this.emotionDetection();
  }

  async startPipeline() {
    this.stopPipeline();

    if (this.frontCamera) {
      await this.emotionDetectionPipeline();
    }
    else {
      this.mlEngine = true;
      this.timer = setInterval(async ()=>{
        if (this.allowSend) {
          this.allowSend = false;
          await this.sendImage()
          .then(()=>{
            this.allowSend = true
          });
        }
        // await this.sendImage();
      },5000);
    }
  }

  stopPipeline() {
    this.mlEngine = false;
    this.allowSend = true;
    clearInterval(this.timer);
    this.status = "";
  }

  startSongAudio() {
    if(this.songAudio) {
      this.songAudio.pause();
    }
    this.songAudioURL = 'http://ganasong.in/siteuploads/files/sfd1/297/Coka%20(%20Sukh-e)%20Mp3%20Song%20320kbps-(GanaSong).mp3';
    this.songAudio = new Audio(this.songAudioURL);
    this.songAudio.onended = () => {
      if (this.frontCamera) {
        console.log("Done");
        //detect expression
        //select song
        //startPipeline
      }
    }
    this.songAudio.play();
  }

  startAlertAudio() {
    this.alertAudio.play();
    this.alertAudio.onended = () =>{
      console.log("Ended");
    }
  }

}
