// logon.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ButtonCuboidComponent } from '../../../../_framework/ui/buttons/button-cuboid/button-cuboid.component';

@Component({
  selector: 'app-logon',
  standalone: true,
  imports: [
    ButtonCuboidComponent,
    ReactiveFormsModule
    ],
    templateUrl: './logon.component.html',
    styleUrls: ['./logon.component.scss']
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

   onLogonButtonClick() {
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

  onButtonClick() {
    this.router.navigate(['/visualization/chorodash']);
  }
}
