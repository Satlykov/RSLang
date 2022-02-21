import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Day, Statistic } from 'src/app/models/interface';
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

  constructor(private statistics: StatisticsService) {}

  days: Day[] = [];

  ngOnInit(): void {
    this.subsStat = this.statistics.stat$.subscribe((stat: Statistic) => {
      this.days = stat.optional.stat.days;
    });
    this.statistics.getStat();
  }

  ngOnDestroy(): void {
    this.subsStat.unsubscribe();
  }
}
