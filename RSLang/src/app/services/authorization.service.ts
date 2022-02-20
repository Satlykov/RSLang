import { Injectable } from '@angular/core';
import { Auth } from '../models/interface';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserWordService } from './user-word.service';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  authenticated = false;
  spinner = true;
  keyStorage = 'userDataRSLang';
  correctRegistEmail = false;
  correctRegistPasworFirst = false;
  correctRegistPasworSecond = false;
  correctRegistName = false;

  correctLoginEmail = false;
  correctLoginPaswor = false;

  userName = '';
  userID = '';
  token = '';

  public authenticatedStatus$ = new Subject<boolean>();
  public spinnerStatus$ = new Subject<boolean>();
  public userName$ = new Subject<string>();

  public changeAuthenticatedStatus(status: boolean) {
    this.authenticatedStatus$.next(status);
  }

  public changeSpinnerStatus(status: boolean) {
    this.spinnerStatus$.next(status);
  }

  public getUserName(name: string) {
    this.userName$.next(name);
  }

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userWordService: UserWordService
  ) {
    this.getToken();
  }

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
      .subscribe(
        (req) => {
          this.spinner = false;
          this.changeSpinnerStatus(this.spinner);
          if (req) {
            this.authenticated = true;
            this.changeAuthenticatedStatus(this.authenticated);
            this.router.navigateByUrl('/');
            this.userName = (req as Auth).name;
            this.userID = (req as Auth).userId;
            this.userWordService.userID = this.userID;
            this.getUserName(this.userName);
            this.localStorageService.setItem(this.keyStorage, req);
          }
        },
        (error) => {
          this.spinner = false;
          this.changeSpinnerStatus(this.spinner);
        }
      );
  }

  regist(name: string, email: string, password: string) {
    this.apiService
      .post('users', {
        name: name,
        email: email,
        password: password,
      })
      .subscribe(
        (req) => {
          this.spinner = false;
          this.changeSpinnerStatus(this.spinner);
        },
        (error) => {
          this.spinner = false;
          this.changeSpinnerStatus(this.spinner);
        }
      );
  }

  logout() {
    this.authenticated = false;
    this.changeAuthenticatedStatus(this.authenticated);
    this.localStorageService.clear();
    this.router.navigateByUrl('/');
    this.userName = '';
    this.getUserName(this.userName);
  }

  checkLogin() {
    if (this.localStorageService.getItem(this.keyStorage)) {
      this.authenticated = true;
      this.changeAuthenticatedStatus(this.authenticated);
      this.userName = (
        this.localStorageService.getItem(this.keyStorage) as Auth
      ).name;
      this.getUserName(this.userName);
      this.userID = (
        this.localStorageService.getItem(this.keyStorage) as Auth
      ).userId;
      this.userWordService.userID = this.userID;
      return true;
    }
    return false;
  }

  getToken() {
    if (this.localStorageService.getItem(this.keyStorage)) {
      this.token = this.localStorageService.getItem(this.keyStorage).token;
    }
  }

  getUserID() {
    return this.userID;
  }

  refreshToken() {
    if (this.localStorageService.getItem(this.keyStorage)) {
      this.token = this.localStorageService.getItem(
        this.keyStorage
      ).refreshToken;
      this.apiService.get(`users/${this.userID}/tokens`).subscribe((res) => {
        this.token = (res as Auth).token;
        const obj = {
          message: 'Authenticated',
          name: this.userName,
          refreshToken: (res as Auth).refreshToken,
          token: (res as Auth).token,
          userId: this.userID,
        };
        this.localStorageService.setItem(this.keyStorage, obj);
        console.log('Token Refresh!');
      });
    }
  }
}
