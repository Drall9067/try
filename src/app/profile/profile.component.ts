import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  genders = ['Male', 'Female', 'Other'];

  rForm: FormGroup;
  registerStatus: boolean;

  constructor(private fb: FormBuilder, private dataService: DataService) {
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
    this.user = this.dataService.currentUser;
    this.rForm.get('firstname').setValue(this.user['firstname']);
    this.rForm.get('lastname').setValue(this.user['lastname']);
    this.rForm.get('gender').setValue(this.user['gender']);
    this.rForm.get('email').setValue(this.user['email']);
  }

  submitForm(data) {
    if(this.rForm.valid){
      this.registerStatus = true;
      var newData = data;
      newData['history'] = {
        'vehicle' : [],
        'drowsiness' : []
      }
      console.log(newData);
      this.dataService.updateUser(newData).subscribe((res) => {
        if(res) {
          
        }
        this.registerStatus = false;
      });
    }
    else {
      this.registerStatus = false;
    }
  }

}
