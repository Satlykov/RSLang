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

  getCardsUser(
    userID: string,
    selected: string,
    page: number
  ): Observable<Object> {
    return this.api.get(
      `users/${userID}/aggregatedWords?wordsPerPage=20&filter={"$and": [{"group": ${selected}}, {"page": ${page}}]}`
    );
  }

  getCardsUserHard(userID: string) {
    return this.api.get(
      `users/${userID}/aggregatedWords?wordsPerPage=3200&filter={"userWord.difficulty": "hard"}`
    );
  }

  getCardsUserStudied(userID: string) {
    return this.api.get(
      `users/${userID}/aggregatedWords?wordsPerPage=3200&filter={"userWord.difficulty": "studied"}`
    );
  }

  getCardsUserHardLevel(userID: string, selected: string) {
    return this.api.get(
      `users/${userID}/aggregatedWords?wordsPerPage=600&filter={"$and": [{"group": ${selected}},{"userWord.difficulty": "hard"}]}`
    );
  }

  getCardsUserStudiedLevel(userID: string, selected: string) {
    return this.api.get(
      `users/${userID}/aggregatedWords?wordsPerPage=600&filter={"$and": [{"group": ${selected}},{"userWord.difficulty": "studied"}]}`
    );
  }
}
