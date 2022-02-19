import { Injectable } from '@angular/core';
import { Statistic } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  allLearnedWords: number = 0;
  today: string = new Date().toJSON().slice(0, 10);
  allStatistics: Statistic = {
    learnedWords: this.allLearnedWords,
    optional: {
      days: [
        {
          studyDay: '1',
          day: '19.02.2022',
          sprint: {

          },
          audio: {

          },
          word: {

          },
          book: {
            
          }
        }
      ],
    },
  };

  constructor() {}
}
