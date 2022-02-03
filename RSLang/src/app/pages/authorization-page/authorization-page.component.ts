import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
})
export class AuthorizationPageComponent implements OnInit {
  hide = true;
  constructor() {}

  ngOnInit(): void {}

  login() {
    console.log('Login!')
  }
}
