import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  keyLocalStorage = 'userDataRSLang';
  correctRegistEmail = false;
  correctRegistPasworFirst = false;
  correctRegistPasworSecond = false;
  correctRegistName = false;

  correctLoginEmail = false;
  correctLoginPaswor = false;

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService
  ) {}

  // General Email Regex (RFC 5322 Official Standard)
  checkEmail(email: string) {
    let validRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  checkNameLength(name: string) {
    return name.length >= 3;
  }

  checkPaswordLength(pas: string) {
    return pas.length >= 8;
  }

  checkCanLogin() {
    return this.correctLoginEmail && this.correctLoginPaswor;
  }

  checkCanRegist() {
    return (
      this.correctRegistName &&
      this.correctRegistEmail &&
      this.correctRegistPasworFirst &&
      this.correctRegistPasworSecond &&
      this.correctRegistPasworFirst === this.correctRegistPasworSecond
    );
  }

  changeEmailLogin(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctLoginEmail = this.checkEmail(value);
    return value;
  }

  changePasswordLogin(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctLoginPaswor = this.checkPaswordLength(value);
    return value;
  }

  changeNameRegist(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctRegistName = this.checkNameLength(value);
    return value;
  }

  changeEmailRegist(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctRegistEmail = this.checkEmail(value);
    return value;
  }

  changePasswordRegistFirst(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctRegistPasworFirst = this.checkPaswordLength(value);
    return value;
  }

  changePasswordRegistSecond(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.correctRegistPasworSecond = this.checkPaswordLength(value);
    return value;
  }

  login(email: string, password: string) {
    this.apiService
      .post('signin', {
        email: email,
        password: password,
      })
      .subscribe((req) => {
        console.log(req);
        this.localStorageService.setItem(this.keyLocalStorage, req);
      });
  }

  regist(name: string, email: string, password: string) {
    this.apiService
      .post('users', {
        name: name,
        email: email,
        password: password,
      })
      .subscribe((req) => {
        console.log(req);
      });
  }
}

