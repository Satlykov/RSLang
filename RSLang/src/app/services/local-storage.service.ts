import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getItem(key: string) {
    if (localStorage.getItem(key) !== null) {
      return JSON.parse(localStorage.getItem(key) as string);
    }
  }

  setItem(key: string, obj: Object): void {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
