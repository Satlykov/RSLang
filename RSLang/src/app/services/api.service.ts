import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendURL } from '../constants/backendURL';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(options: string) {
    return this.http.get(backendURL + '/' + options);
  }

  post(options: string, obj: Object) {
    return this.http.post(backendURL + '/' + options, obj);
  }

  delete(options: string) {
    return this.http.delete<void>(backendURL + '/' + options);
  }

  put(options: string, obj: Object) {
    return this.http.put(backendURL + '/' + options, obj);
  }
}
