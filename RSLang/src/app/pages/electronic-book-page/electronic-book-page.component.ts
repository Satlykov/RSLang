import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ElectronicBookService } from 'src/app/services/electronic-book.service';
import { Router } from '@angular/router';
import { SprintGamePageComponent } from '../sprint-game-page/sprint-game-page.component';
import { SprintGameService } from 'src/app/services/sprint-game.service';

@Component({
  selector: 'app-electronic-book-page',
  templateUrl: './electronic-book-page.component.html',
  styleUrls: ['./electronic-book-page.component.scss'],
})
export class ElectronicBookPageComponent implements OnInit {
  authenticated = false;
  selected: string = 'group=0';
  levels = [
    { value: 'group=0', viewValue: 'A1 Elementary' },
    { value: 'group=1', viewValue: 'A2 Pre-Intermediate' },
    { value: 'group=2', viewValue: 'B1 IIntermediate' },
    { value: 'group=3', viewValue: 'B2 Upper-Intermediate' },
    { value: 'group=4', viewValue: 'C1 Advanced' },
    { value: 'group=5', viewValue: 'C2 Proficiency' },
  ];

  backColors = [
    'linear-gradient(90deg, rgba(36,29,253,1) 0%, rgba(39,255,0,1) 100%)',
    'linear-gradient(90deg, rgba(34,102,195,1) 0%, rgba(253,247,45,1) 100%)',
    'linear-gradient(90deg, rgba(253,85,29,1) 0%, rgba(252,176,69,1) 100%)',
    'linear-gradient(90deg, rgba(175,29,253,1) 0%, rgba(69,252,225,1) 100%)',
    'linear-gradient(90deg, rgba(253,29,109,1) 0%, rgba(69,239,252,1) 100%)',
    'linear-gradient(90deg, rgba(253,29,29,1) 0%, rgba(69,252,179,1) 100%)',
    'radial-gradient(circle, rgba(244,251,63,1) 0%, rgba(252,70,70,1) 100%)',
  ];

  public cards!: Observable<any>;

  numberPage = 0;
  plusPage = true;
  minusPage = false;

  backColor = this.backColors[1];

  private subsCards: Subscription = new Subscription();

  constructor(
    private electronicBookService: ElectronicBookService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private sprintGameService: SprintGameService,
  ) {}

  ngOnInit(): void {
    this.getCards();
    this.authenticated = this.authorizationService.checkLogin();
  }

  ngOnDestroy(): void {
    this.subsCards.unsubscribe();
  }

  getCards() {
    this.cards = this.electronicBookService.getCards(
      this.selected,
      this.numberPage
    );
  }

  setNumberPage(num: number) {
    this.numberPage = num;
    this.getCards();
    this.checkPage();
  }

  plusNumberPage() {
    if (this.numberPage !== 29) {
      this.numberPage += 1;
      this.getCards();
    }
    this.checkPage();
  }

  minusNumberPage() {
    if (this.numberPage !== 0) {
      this.numberPage -= 1;
      this.getCards();
    }
    this.checkPage();
  }

  checkPage() {
    if (this.numberPage === 29) {
      this.plusPage = false;
    } else {
      this.plusPage = true;
    }
    if (this.numberPage === 0) {
      this.minusPage = false;
    } else {
      this.minusPage = true;
    }
  }

  changeLevel() {
    this.backColor = this.backColors[+this.selected.split('=')[1]];
    this.getCards();
  }

  startSprint() {
    this.sprintGameService.fromBook = true;
    this.sprintGameService.selected = this.selected;
    this.router.navigateByUrl('/sprint-game');
  }
}
