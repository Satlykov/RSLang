import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private sidenav: LayoutService) {}

  ngOnInit(): void {}

  clickMenu() {
    this.sidenav.toggle();
  }
}
