import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Paginated, Word } from '../models/interface';
import { ApiService } from './api.service';
import { AuthorizationService } from './authorization.service';

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
  fromBook = false;
  selected = '';
  numberPage = 0;

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

  constructor(
    private api: ApiService,
    private authorizationService: AuthorizationService
  ) {}

  getWords(selected: string, page: number) {
    this.api.get(`words?${selected}&page=${page}`).subscribe(
      (res) => {
        this.wordsSprint.push(...(res as Word[]));
        this.getWordsSprint(this.wordsSprint);
      },
      (error) => console.log(error)
    );
  }

  getUserWords(userID: string, selected: string, page: number) {
    this.api
      .get(
        `users/${userID}/aggregatedWords?wordsPerPage=20&filter={"$and": [{"group": ${selected}}, {"page": ${page}}]}`
      )
      .pipe(
        switchMap((words) =>
          of((words as Array<Paginated>)[0].paginatedResults)
        )
      )
      .subscribe(
        (res) => {
          this.wordsSprint.push(...(res as Word[]));
          this.getWordsSprint(this.wordsSprint);
        },
        (error) => {
          if (error.status === 401) {
            this.authorizationService.refreshToken();
            setTimeout(() => {
              this.getUserWords(userID, selected, page);
            }, 500);
          }
        }
      );
  }

  getUserWordsFromeBook(userID: string, selected: string, page: number) {
    this.api
      .get(
        `users/${userID}/aggregatedWords?wordsPerPage=20&filter={"$and": [{"group": ${selected}}, {"page": ${page}}, {"userWord":null}]}`
      )
      .pipe(
        switchMap((words) =>
          of((words as Array<Paginated>)[0].paginatedResults)
        )
      )
      .subscribe(
        (res) => {
          console.log(res as Word[]);
          this.wordsSprint.push(...(res as Word[]));
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
    this.percent = Math.floor((this.correctAnswers / this.answers) * 100);
    if (this.correctAnswers === 0) {
      this.percent = 0;
    }
    this.getStreak(this.streakAnswers);
    this.getMultiplier();
    this.getScore(this.score);
    this.getPercent(this.percent);
    return answer === translateWord;
  }

  stopWatch(sec: number): Observable<number> {
    return interval(1000).pipe(take(sec + 1));
  }

  closeSprint() {
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

  getStat(userID: string) {
    this.api.get(`users/${userID}/statistics`).subscribe((res) => {
      console.log(res);
    });
  }

  putStat(userID: string) {
    this.api
      .put(`users/${userID}/statistics`, {
        learnedWords: 33,
        optional: {
          day: '19.02.2022',
        },
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
