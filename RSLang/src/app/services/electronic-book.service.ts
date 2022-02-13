import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Word } from '../models/interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronicBookService {
  constructor(private api: ApiService) { }

  getCards(selected: string, page: number): Observable<Object> {
    return this.api.get(`words?${selected}&page=${page}`);
  }
}
