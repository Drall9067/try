import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  currentUrl: string;

  constructor(private router: Router) {
    router.events.subscribe((_: NavigationEnd) => {
      this.currentUrl = router.url;
    });
  }

  ngOnInit() {
  }

}
