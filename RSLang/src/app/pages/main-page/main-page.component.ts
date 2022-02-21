import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
  }

  scrollTo() {
    this.viewportScroller.scrollToAnchor('main-page');
  }
}
