import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of, Subscription, switchMap } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ElectronicBookService } from 'src/app/services/electronic-book.service';
import { Router } from '@angular/router';
import { SprintGameService } from 'src/app/services/sprint-game.service';
import { Paginated, Word } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-electronic-book-page',
  templateUrl: './electronic-book-page.component.html',
  styleUrls: ['./electronic-book-page.component.scss'],
})
export class ElectronicBookPageComponent implements OnInit {
  public authenticated = false;
  public userID = '';
  public selected: string = 'group=0';
  public canPlay = true;
  levels = [
    { value: 'group=0', viewValue: 'A1 Elementary' },
    { value: 'group=1', viewValue: 'A2 Pre-Intermediate' },
    { value: 'group=2', viewValue: 'B1 Intermediate' },
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

  public numberPage:number = 0;
  public plusPage = true;
  public minusPage = false;

  public backColor = this.backColors[1];

  private subsCards: Subscription = new Subscription();

  constructor(
    private electronicBookService: ElectronicBookService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private sprintGameService: SprintGameService,
    private audioGameService: AudioCallGameService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.localStorageService.getItem('EBookPage')) {
      this.numberPage = +this.localStorageService.getItem('EBookPage').page;
      this.selected = this.localStorageService.getItem('EBookPage').selected;
    }
    this.authenticated = this.authorizationService.checkLogin();
    this.userID = this.authorizationService.getUserID();
    this.getCards();
    this.checkPage();
  }

  ngOnDestroy(): void {
    this.subsCards.unsubscribe();
  }

  getCards() {
    if (this.authenticated) {
      this.cards = this.electronicBookService
        .getCardsUser(this.userID, this.selected.split('=')[1], this.numberPage)
        .pipe(
          switchMap((cards) =>
            of((cards as Array<Paginated>)[0].paginatedResults)
          ),
          catchError((err) => {
            console.log(err);
            return [];
          })
        );
      this.cards.subscribe((cards) => {
        const index = cards.findIndex(
          (card: Word) => card.userWord === undefined
        );
        this.canPlay = index !== -1;
      });
    } else {
      this.cards = this.electronicBookService.getCards(
        this.selected,
        this.numberPage
      );
    }
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
    this.plusPage = this.numberPage !== 29;
    this.minusPage = this.numberPage !== 0;
    this.localStorageService.setItem('EBookPage', { page: this.numberPage, selected: this.selected });
  }
  changeLevel() {
    this.backColor = this.backColors[+this.selected.split('=')[1]];
    this.getCards();
    this.localStorageService.setItem('EBookPage', { page: this.numberPage, selected: this.selected });
  }

  startSprint() {
    this.sprintGameService.fromBook = true;
    this.sprintGameService.selected = this.selected;
    this.sprintGameService.numberPage = this.numberPage;
    this.router.navigateByUrl('/sprint-game');
  }

  startAudioCallGame(): void {
    const group = this.selected.split('=')[1];
    this.audioGameService.fromBook = true;
    this.audioGameService.dataFromBook.group = Number(group);
    this.audioGameService.dataFromBook.page = this.numberPage;
    this.router.navigateByUrl('/audio-call-game');
  }
}
