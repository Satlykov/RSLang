import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Word } from '../models/interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SprintGameService {
  gameSecond = 60;
  sprintStatus = false;
  wordsSprint: Word[] = [];
  numberWord = 0;
  streakAnswers = 0;
  answers = 0;
  correctAnswers = 0;
  percent = 0;
  score = 0;
  multiplier = 1;
  pointsForAnswer = 10 * this.multiplier;

  public sprintWords$ = new Subject<Word[]>();
  public streak$ = new Subject<number>();
  public score$ = new Subject<number>();
  public percent$ = new Subject<number>();

  public getWordsSprint(wordsSprint: Word[]) {
    this.sprintWords$.next(wordsSprint);
  }

  public getStreak(streakAnswers: number) {
    this.streak$.next(streakAnswers);
  }

  public getScore(score: number) {
    this.score$.next(score);
  }

  public getPercent(percent: number) {
    this.percent$.next(percent);
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
    this.answers += 1;
    if (answer === translateWord) {
      this.streakAnswers += 1;
      this.score += 10 * this.multiplier;
      this.correctAnswers += 1;
    } else {
      this.streakAnswers = 0;
    }
    this.getStreak(this.streakAnswers);
    this.getMultiplier();
    this.getScore(this.score);
    return answer === translateWord;
  }

  /* stopWatch() {
    let second = 60;
    const stopWatchSeconds = setInterval(() => {
      second -= 1;
      if (second === 0) {
        this.percent = Math.floor((this.correctAnswers / this.answers) * 100);
        if (this.correctAnswers === 0) {
          this.percent = 0;
        }
        clearInterval(stopWatchSeconds);
        this.getPercent(this.percent);
      }
      this.gameSecond = second;
      this.getSecond(this.gameSecond);
    }, 1000);
  } */

  stopWatch() {
    const takeSecond$ = interval(1000).pipe(take(61));
    takeSecond$.subscribe((x) => (this.gameSecond = 60 - x));
  }

  closeSprint() {
    this.gameSecond = 60;
    this.sprintStatus = false;
    this.wordsSprint = [];
    this.numberWord = 0;
    this.streakAnswers = 0;
    this.answers = 0;
    this.correctAnswers = 0;
    this.percent = 0;
    this.score = 0;
    this.multiplier = 1;
  }
}
