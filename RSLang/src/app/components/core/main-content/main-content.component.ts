import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from 'src/app/services/layout.service';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  authenticated = false;
  private subs: Subscription = new Subscription();

  constructor(
    private layoutService: LayoutService,
    private authorizationService: AuthorizationService,

  ) {}

  ngOnInit(): void {
    this.layoutService.sideNavToggleSubject.subscribe(() => {
      if (this.sidenav) this.sidenav.toggle();
    });
    this.subs = this.authorizationService.authenticatedStatus$.subscribe(
      (status: boolean) => {
        this.authenticated = status;
      }
    );
    this.authorizationService.checkLogin();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
