import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
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
    correctAnswersPercentage: 0,
  };
  gamesStatistic: GamesStatistic = {
    newWords: 0,
    correctAnswersPercentageDay: [],
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

  lengthArr = this.statisticAll.optional.stat.days.length;
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
            }
          }
          console.log(res);
        },
        (error) => {
          if (error.status) {
            this.putStat();
          }
        }
      );
  }

  putStat() {
    console.log(this.statisticAll);
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
    longestStreak: number
  ) {
    if (
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
        .gamesDay === 0
    ) {
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint.newWords =
        newWords;
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.longestStreak = longestStreak;
    } else {
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.newWords += newWords;
      if (
        this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
          .longestStreak < longestStreak
      ) {
        this.statisticAll.optional.stat.days[
          this.lengthArr - 1
        ].sprint.longestStreak = longestStreak;
      }
    }
    (
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
        .correctAnswersPercentageDay as Number[]
    ).push(percent);
    this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint.gamesDay =
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.correctAnswersPercentageDay.length;
    console.log(
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
    );
    this.putStat();
  }
}
