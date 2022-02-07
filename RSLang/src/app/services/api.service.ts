import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendURL } from '../constants/backendURL';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(path: string) {
    return this.http.get(backendURL + '/' + path);
  }

  post(path: string, obj: Object) {
    return this.http.post(backendURL + '/' + path, obj);
  }

  delete(path: string) {
    return this.http.delete<void>(backendURL + '/' + path);
  }

  put(path: string, obj: Object) {
    return this.http.put(backendURL + '/' + path, obj);
  }
}
