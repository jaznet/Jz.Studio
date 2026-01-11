import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { JzButtonCuboid } from '../../../../components/buttons/jz-button-cuboid/jz-button-cuboid';
import { JzButton3dComponent } from '../../../../components/buttons/jz-button3d/jz-button3d.component';

@Component({
  selector: 'app-logon',
  imports: [
    JzButtonCuboid,
    JzButton3dComponent,
    ReactiveFormsModule
    ],
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
  @Input() text: any;

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['guest', Validators.required],
      password: ['1234', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      var username = this.loginForm.value.username;
      var password = this.loginForm.value.password;
      username = 'guest';
      password = 'login';
      // Implement your login logic here
      console.log('Username:', username);
      console.log('Password:', password);
    }
  }

   onButtonClick() {
    if (this.loginForm.valid) {
      var username = this.loginForm.value.username;
      var password = this.loginForm.value.password;
      username = 'guest';
      password = 'login';
      // Implement your login logic here
      console.log('Username:', username);
      console.log('Password:', password);
    }
    console.log('Button clicked!');
    this.router.navigateByUrl('/home');
  }
}
