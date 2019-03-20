import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  genders = ['Male', 'Female', 'Other'];

  rForm: FormGroup;
  registerStatus: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private dataService: DataService) {
    this.rForm = fb.group({
      'firstname' : [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32)
        ])
      ],
      'lastname' : [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32)
        ])
      ],
      'gender' : [null, Validators.required],
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
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32)
        ])
      ]
    });

    this.registerStatus = true;
  }

  ngOnInit() {
  }

  submitForm(data) {
    this.registerStatus = true;
    var newData = data;
    newData['history'] = {
      'vehicle' : [],
      'drowsiness' : []
    }
    console.log(newData);
    this.dataService.addUser(newData).subscribe((res) => {
      if(res) {
        this.router.navigate(['../dashboard'])
      }
      this.registerStatus = false;
    });
  }

}
