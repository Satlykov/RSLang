import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BookStatistic,
  GamesStatistic,
  Statistic,
  StatisticDelete,
  WordStatistic,
} from '../models/interface';
import { ApiService } from './api.service';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  allLearnedWords: number = 0;
  date: string = new Date().toLocaleDateString();

  wordStatistic: WordStatistic = {
    newWords: 0,
    studiedWords: 0,
    studiedWordsDay: 0,
    correctAnswersPercentage: 0,
  };
  gamesStatistic: GamesStatistic = {
    newWords: 0,
    correctAnswersPercentageDay: [],
    percentageDay: 0,
    gamesDay: 0,
    longestStreak: 0,
  };
  bookStatistic: BookStatistic = {
    newWords: 0,
    notedHard: 0,
    notedStudied: 0,
  };

  statisticAll: Statistic = {
    learnedWords: 0,
    optional: {
      stat: {
        days: [
          {
            date: this.date,
            studyDay: 1,
            words: this.wordStatistic,
            sprint: this.gamesStatistic,
            audio: this.gamesStatistic,
            book: this.bookStatistic,
          },
        ],
      },
    },
  };

  lengthArr = 0;

  public stat$ = new Subject<Statistic>();

  public getStatToComponent(stat: Statistic) {
    this.stat$.next(stat);
  }
  constructor(
    private api: ApiService,
    private authorizationService: AuthorizationService
  ) {
    this.getStat();
  }

  getStat() {
    this.api
      .get(`users/${this.authorizationService.userID}/statistics`)
      .subscribe(
        (res) => {
          this.statisticAll.optional = (res as Statistic).optional;
          this.statisticAll.learnedWords = (res as Statistic).learnedWords;
          this.lengthArr = this.statisticAll.optional.stat.days.length;
          if (this.statisticAll.optional !== undefined) {
            if (
              this.statisticAll.optional.stat?.days.findIndex(
                (item) => item.date === this.date
              ) === -1
            ) {
              let newDate = {
                date: this.date,
                studyDay: +(
                  this.statisticAll.optional.stat.days[
                    this.statisticAll.optional.stat.days.length - 1
                  ].studyDay + 1
                ),
                words: this.wordStatistic,
                sprint: this.gamesStatistic,
                audio: this.gamesStatistic,
                book: this.bookStatistic,
              };
              this.statisticAll.optional.stat?.days.push(newDate);
              this.lengthArr = this.statisticAll.optional.stat.days.length;
            }
          }
          console.log(res as Statistic);
          this.getStatToComponent(res as Statistic);
        },
        (error) => {
          if (error.status) {
            this.putStat();
          }
        }
      );
  }

  putStat() {
    this.api
      .put(
        `users/${this.authorizationService.userID}/statistics`,
        this.statisticAll
      )
      .subscribe(
        () => {},
        (error) => console.log(error)
      );
  }

  deleteStatBackend() {
    let obj: StatisticDelete = {
      learnedWords: 0,
      optional: {},
    };
    this.api
      .put(`users/${this.authorizationService.userID}/statistics`, obj)
      .subscribe((res) => {
        console.log(res);
      });
  }

  addSprintStatistics(
    newWords: number,
    percent: number,
    longestStreak: number,
    learnedWords: number
  ) {
    if (
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
        .gamesDay === 0
    ) {
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.longestStreak = longestStreak;
    } else {
      if (
        this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
          .longestStreak < longestStreak
      ) {
        this.statisticAll.optional.stat.days[
          this.lengthArr - 1
        ].sprint.longestStreak = longestStreak;
      }
    }

    this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint.newWords +=
      newWords;

    this.statisticAll.optional.stat.days[this.lengthArr - 1].words.newWords +=
      newWords;

    let percentArr: Array<number> = this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].sprint.correctAnswersPercentageDay as Array<number>;
    percentArr.push(percent);

    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].sprint.percentageDay = Math.round(
      percentArr.reduce((a, b) => a + b) / percentArr.length
    );

    if (
      this.statisticAll.optional.stat.days[this.lengthArr - 1].audio
        .percentageDay === 0
    ) {
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].words.correctAnswersPercentage =
        this.statisticAll.optional.stat.days[
          this.lengthArr - 1
        ].sprint.percentageDay;
    } else {
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].words.correctAnswersPercentage = Math.round(
        (this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
          .percentageDay +
          this.statisticAll.optional.stat.days[this.lengthArr - 1].audio
            .percentageDay) /
          2
      );
    }

    this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint.gamesDay =
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.correctAnswersPercentageDay.length;
    this.statisticAll.learnedWords += learnedWords;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.studiedWords = this.statisticAll.learnedWords;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.studiedWordsDay += learnedWords;
    console.log(
      this.lengthArr - 1,
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
    );
    this.putStat();
  }

  addToHard() {
    this.statisticAll.optional.stat.days[this.lengthArr - 1].book.newWords += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.newWords += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].book.notedHard += 1;
  }

  addToStudied() {
    this.statisticAll.learnedWords += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.studiedWordsDay += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.studiedWords = this.statisticAll.learnedWords;
    this.statisticAll.optional.stat.days[this.lengthArr - 1].book.newWords += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].words.newWords += 1;
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].book.notedStudied += 1;
  }
}
