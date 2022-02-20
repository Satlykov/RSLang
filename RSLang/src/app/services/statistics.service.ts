import { Injectable } from '@angular/core';
import { Statistic } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  allLearnedWords: number = 0;
  constructor() {}

}
