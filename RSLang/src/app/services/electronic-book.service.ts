import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ElectronicBookService {
  constructor(private api: ApiService) {}

  getCards(selected: string, page: number): Observable<Object> {
    return this.api.get(`words?${selected}&page=${page}`);
  }

  getCardsUser(userID: string, selected: string, page: number): Observable<Object> {
    return this.api.get(`users/${userID}/aggregatedWords?wordsPerPage=20&filter={"$and": [{"group": ${selected}}, {"page": ${page}}]}`);
  }
}
