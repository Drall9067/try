import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUrl: string;

  constructor(private router: Router) {
    router.events.subscribe((_: NavigationEnd) => {
      this.currentUrl = router.url;
    });
  }

  ngOnInit() {
  }

}
