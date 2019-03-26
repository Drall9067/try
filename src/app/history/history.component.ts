import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  // userData: any;

  // userData = {
  //   'history' : {
  //     'vehicle' : [10,5,8,7,12,8,6,10,9,5,5,9,3,4,10,6,10,7,5,9],
  //     'drowsiness' : [0,2,0,0,3,1,0,1,0,2,2,2,1,0,2,1,1,0,2,0]
  //   }
  // }
  userData: any;
  chartVehicle:any;
  chartDrowsiness:any;
  constructor(private dataServie: DataService) { }

  ngOnInit() {
    this.userData = this.dataServie.currentUser;

    if(this.userData) {
      var label = [];
      var i;
      for(i=1; i<=this.userData['history']['vehicle'].length; i++){
        label.push(String(i))
      }
      console.log(label)
    
      this.chartVehicle = new Chart('canvasVehicle', {
        type : 'line',
        data : {
          labels : label,
          datasets : [
            {
              label : '# of encounters',
              data : this.userData['history']['vehicle'],
              borderColor : 'red',
              fill : true,
              backgroundColor : 'rgba(255,0,0,0.1)'
            }
          ]
        },
        options : {
          responsive : true,
          legend : {
            display : false
          }
        }
      });

      var label = [];
      var i;
      for(i=1; i<=this.userData['history']['drowsiness'].length; i++){
        label.push(String(i))
      }
      console.log(label)
    
      this.chartDrowsiness = new Chart('canvasDrowsiness', {
        type : 'line',
        data : {
          labels : label,
          datasets : [
            {
              label : '# of drowsiness',
              data : this.userData['history']['drowsiness'],
              borderColor : 'blue',
              fill : true,
              backgroundColor : 'rgba(0,0,255,0.1)'
            }
          ]
        },
        options : {
          responsive : true,
          legend : {
            display : false
          }
        }
      });
    }
  }

}
