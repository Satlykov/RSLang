import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  userName = '';
  private subsStatus: Subscription = new Subscription;
  private subsName: Subscription = new Subscription;

  constructor(
    private sidenav: LayoutService,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.subsStatus = this.authorizationService.authenticatedStatus$.subscribe(
      (status: boolean) => {
        this.authenticated = status;
      }
    );
    this.subsName = this.authorizationService.userName$.subscribe(
      (name: string) => {
        this.userName = name;
      }
    )
  }

  ngOnDestroy(): void {
    this.subsStatus.unsubscribe();
    this.subsName.unsubscribe();
  }

  clickMenu() {
    this.sidenav.toggle();
  }
}
