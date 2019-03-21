import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUrl: string;
  loggedIn: boolean;

  constructor(private router: Router, private dataService: DataService) {
    router.events.subscribe((_: NavigationEnd) => {
      this.currentUrl = router.url;
    });
    this.dataService.loginStatus.subscribe((value) => {
      this.loggedIn = value;
    });
  }

  ngOnInit() { }

  logOut() {
    this.dataService.logOut();
  }

}
