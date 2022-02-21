import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
})
export class AuthorizationPageComponent implements OnInit {
  hide = true;
  spinner = false;

  canLogin = false;
  canRegist = false;

  inputEmailLogin = '';
  inputPasswordLogin = '';

  inputNameRegist = '';
  inputEmailRegist = '';
  inputPasswordRegistFirst = '';
  inputPasswordRegistSecond = '';

  private subs: Subscription = new Subscription();

  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.subs = this.authorizationService.spinnerStatus$.subscribe(
      (staus: boolean) => {
        this.spinner = staus;
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  changeEmailLogin(event: Event) {
    this.inputEmailLogin = this.authorizationService.changeEmailLogin(event);
    this.canLogin = this.authorizationService.checkCanLogin();
  }

  changePasswordLogin(event: Event) {
    this.inputPasswordLogin =
      this.authorizationService.changePasswordLogin(event);
    this.canLogin = this.authorizationService.checkCanLogin();
  }

  changeNameRegist(event: Event) {
    this.inputNameRegist = this.authorizationService.changeNameRegist(event);
    this.canRegist = this.authorizationService.checkCanRegist();
  }

  changeEmailRegist(event: Event) {
    this.inputEmailRegist = this.authorizationService.changeEmailRegist(event);
    this.canRegist = this.authorizationService.checkCanRegist();
  }

  changePasswordRegistFirst(event: Event) {
    this.inputPasswordRegistFirst =
      this.authorizationService.changePasswordRegistFirst(event);
    this.canRegist = this.authorizationService.checkCanRegist();
  }

  changePasswordRegistSecond(event: Event) {
    this.inputPasswordRegistSecond =
      this.authorizationService.changePasswordRegistSecond(event);
    this.canRegist = this.authorizationService.checkCanRegist();
  }

  login() {
    if (this.canLogin) {
      this.authorizationService.login(
        this.inputEmailLogin,
        this.inputPasswordLogin
      );
      this.spinner = true;
    }
  }

  regist() {
    if (this.canRegist) {
      this.authorizationService.regist(
        this.inputNameRegist,
        this.inputEmailRegist,
        this.inputPasswordRegistFirst
      );
      this.spinner = true;
    }
  }
}
