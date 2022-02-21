import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Observable, Subscription } from 'rxjs';
import { Chart, Day, Statistic } from 'src/app/models/interface';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
  selected: string = 'words';

  types = [
    { value: 'words', viewValue: 'Слова' },
    { value: 'sprint', viewValue: 'Спринт' },
    { value: 'audio', viewValue: 'Аудиовызов' },
    { value: 'book', viewValue: 'Учебник' },
    { value: 'chart-new-words', viewValue: 'График новых слов' },
    { value: 'chart-studied-words', viewValue: 'График изученных слов' },
  ];

  private subsStat: Subscription = new Subscription();

  days: Day[] = [];
  allLearnedWords: number = 0;

  daysNewWords: Array<Chart> = [];
  daysLearnedWords: Array<Chart> = [];

  gradinet: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;
  legendTitle1: string = 'Даты обучения:';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Даты';
  yAxisLabel: string = 'Новые слова';
  yAxisLabel2: string = 'Изученные слова';
  showDataLabel: boolean = true;
  showGridLines: boolean = true;

  constructor(private statistics: StatisticsService) {}

  ngOnInit(): void {
    this.subsStat = this.statistics.stat$.subscribe((stat: Statistic) => {
      this.days = stat.optional.stat.days;
      this.allLearnedWords = stat.learnedWords;
      this.days.map((el: any) => {
        let obj1: Chart = {
          name: el.date,
          value: +el.words.newWords,
        };
        let obj2: Chart = {
          name: el.date,
          value: el.words.studiedWords,
        };
        this.daysNewWords.push(obj1);
        this.daysLearnedWords.push(obj2);
        return;
      });
    });
    this.statistics.getStat();
  }

  ngOnDestroy(): void {
    this.subsStat.unsubscribe();
  }
}
