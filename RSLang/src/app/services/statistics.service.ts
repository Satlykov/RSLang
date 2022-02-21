import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import {
  BookStatistic,
  Day,
  GamesStatistic,
  Paginated,
  Statistic,
  StatisticDelete,
  WordStatistic,
} from '../models/interface';
import { ApiService } from './api.service';
import { AuthorizationService } from './authorization.service';
import { ElectronicBookService } from './electronic-book.service';

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

  lengthArr = this.statisticAll.optional.stat.days.length;

  public stat$ = new Subject<Statistic>();

  public getStatToComponent(stat: Statistic) {
    this.stat$.next(stat);
  }
  constructor(
    private api: ApiService,
    private authorizationService: AuthorizationService,
    private electronicBookService: ElectronicBookService
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
          console.log((res as Statistic).optional.stat.days);
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
    let percentArr: Array<number> = this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].sprint.correctAnswersPercentageDay as Array<number>;
    percentArr.push(percent);
    this.statisticAll.optional.stat.days[
      this.lengthArr - 1
    ].sprint.percentageDay =
      percentArr.reduce((a, b) => a + b) / percentArr.length;
    this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint.gamesDay =
      this.statisticAll.optional.stat.days[
        this.lengthArr - 1
      ].sprint.correctAnswersPercentageDay.length;
    console.log(
      this.statisticAll.optional.stat.days[this.lengthArr - 1].sprint
    );
    this.getLearnedWords();
    this.putStat();
  }

  getLearnedWords() {
    this.electronicBookService
      .getCardsUserStudied(this.authorizationService.getUserID())
      .pipe(
        switchMap((cards) =>
          of((cards as Array<Paginated>)[0].paginatedResults)
        )
      )
      .subscribe((cards) => {
        this.statisticAll.learnedWords = cards.length;
      });
  }
}
