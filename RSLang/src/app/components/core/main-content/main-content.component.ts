import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.sideNavToggleSubject.subscribe(() => {
      if (this.sidenav) this.sidenav.toggle();
    });
  }
}
