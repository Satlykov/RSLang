import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  getItem(key: string) {
    if (sessionStorage.getItem(key) !== null) {
      return JSON.parse(sessionStorage.getItem(key) as string);
    }
  }

  setItem(key: string, obj: Object): void {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }

  removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
