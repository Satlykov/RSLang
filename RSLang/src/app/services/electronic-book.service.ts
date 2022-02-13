import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Word } from '../models/interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronicBookService {
  cards: Word[] = [];

  public cardsBook$ = new Subject<Word[]>();

  public getCardsStream(cards: Word[]) {
    this.cardsBook$.next(cards);
  }

  constructor(private api: ApiService) { }

  getCards(selected: string, page: number) {
    this.api.get(`words?${selected}&page=${page}`).subscribe(
      (res) => {
        this.cards.push(...(res as Word[]));
        this.getCardsStream(this.cards);
      },
      (error) => console.log(error)
    );
  }
}
