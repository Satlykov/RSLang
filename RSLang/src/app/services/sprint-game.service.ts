import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Word } from '../models/interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SprintGameService {
  sprintStatus = false;
  wordsSprint: Word[] = [];
  numberWord = 0;
  streakAnswers = 0;
  score = 0;
  multiplier = 1;
  pointsForAnswer = 10 * this.multiplier;

  public sprintWords$ = new Subject<Word[]>();
  public streak$ = new Subject<number>();
  public score$ = new Subject<number>();

  public getWordsSprint(wordsSprint: Word[]) {
    this.sprintWords$.next(wordsSprint);
  }

  public getStreak(streakAnswers: number) {
    this.streak$.next(streakAnswers);
  }

  public getScore(score: number) {
    this.score$.next(score);
  }

  constructor(private api: ApiService) {}

  getWords(selected: string, page: number) {
    this.api.get(`words?${selected}&page=${page}`).subscribe(
      (req) => {
        this.wordsSprint.push(...(req as Word[]));
        this.getWordsSprint(this.wordsSprint);
      },
      (error) => console.log(error)
    );
  }

  getMultiplier() {
    this.multiplier = Math.floor(this.streakAnswers / 3) + 1;
    if (this.multiplier > 5) {
      this.multiplier = 5;
    }
  }

  cheackAnswer(answer: boolean, translateWord: boolean) {
    if (answer === translateWord) {
      this.streakAnswers += 1;
      this.score += 10 * this.multiplier;
    } else {
      this.streakAnswers = 0;
    }
    this.getStreak(this.streakAnswers);
    this.getMultiplier();
    this.getScore(this.score);
    return answer === translateWord;
  }
}
