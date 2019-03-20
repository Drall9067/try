import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rForm: FormGroup;
  loginStatus: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private dataService: DataService) {
    this.rForm = fb.group({
      'email' : [
        null,
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ],
      'password' : [
        null,
        Validators.compose([
          Validators.required
        ])
      ]
    });
    this.loginStatus = true
  }

  ngOnInit() {
  }

  submitForm(data) {
    this.loginStatus = true;
    console.log(data)
    this.dataService.checkUser(data).subscribe((res) => {
      if(res) {
        this.router.navigate(['../dashboard'])
      }
      this.loginStatus = false
    });
  }

}
