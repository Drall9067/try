import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any;
  dataName: any;

  constructor(private data_service: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.data_service.getStore().subscribe((res) => {
      console.log(res);
      this.data = res['stores'];
    });

    this.data_service.getStoreName('My Wonderful Store').subscribe((res) => {
      console.log(res);
      this.dataName = res['items'];
    });
  }

}
