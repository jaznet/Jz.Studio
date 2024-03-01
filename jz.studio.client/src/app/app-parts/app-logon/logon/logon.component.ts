import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
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
