import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    private viewportScroller: ViewportScroller,
    private authorizationService: AuthorizationService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {}

  scrollTo() {
    this.viewportScroller.scrollToAnchor('main-page');
  }

  getStat() {
    if (this.authorizationService.authenticated) {
      this.statisticsService.getStat();
    }
  }
}
