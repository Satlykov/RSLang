import { Injectable } from '@angular/core';
import { UserWord, Word } from '../models/interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserWordService {
  userID = '';
  userHardWords: Word[] = [];

  constructor(private api: ApiService) {}

  getUserWords() {
    return this.api.get(`users/${this.userID}/words`);
  }

  postUserWord(wordID:string ,obj: UserWord) {
    return this.api.post(`users/${this.userID}/words/${wordID}`, obj)
  }

  getUserWord(wordID:string) {
    return this.api.get(`users/${this.userID}/words/${wordID}`);
  }

  putUserWord(wordID:string ,obj: UserWord) {
    return this.api.put(`users/${this.userID}/words/${wordID}`, obj)
  }

  deleteUserWord(wordID:string) {
    return this.api.delete(`users/${this.userID}/words/${wordID}`)
  }
}
