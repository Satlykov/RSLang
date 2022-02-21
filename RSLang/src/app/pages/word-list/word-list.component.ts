import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Paginated } from 'src/app/models/interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ElectronicBookService } from 'src/app/services/electronic-book.service';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export class WordListComponent implements OnInit {
  selected: string = 'all';
  selectedWord: string = 'hard';

  levels = [
    { value: 'all', viewValue: 'Все' },
    { value: '0', viewValue: 'A1 Elementary' },
    { value: '1', viewValue: 'A2 Pre-Intermediate' },
    { value: '2', viewValue: 'B1 Intermediate' },
    { value: '3', viewValue: 'B2 Upper-Intermediate' },
    { value: '4', viewValue: 'C1 Advanced' },
    { value: '5', viewValue: 'C2 Proficiency' },
  ];

  types = [
    { value: 'hard', viewValue: 'Сложные' },
    { value: 'studied', viewValue: 'Изученные' },
  ];

  public cards!: Observable<any>;
  userID = '';
  public isEmpty = false;

  constructor(
    private authorizationService: AuthorizationService,
    private electronicBookService: ElectronicBookService,
    private audioCallGameService: AudioCallGameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userID = this.authorizationService.getUserID();
    this.getCards();
  }

  getCards() {
    if (this.selected === 'all') {
      if (this.selectedWord === 'hard') {
        this.cards = this.electronicBookService
          .getCardsUserHard(this.userID)
          .pipe(
            switchMap((cards) =>
              of((cards as Array<Paginated>)[0].paginatedResults)
            )
          )
      } else if (this.selectedWord === 'studied') {
        this.cards = this.electronicBookService
          .getCardsUserStudied(this.userID)
          .pipe(
            switchMap((cards) =>
              of((cards as Array<Paginated>)[0].paginatedResults)
            )
          );
      }
    } else {
      if (this.selectedWord === 'hard') {
        this.cards = this.electronicBookService
          .getCardsUserHardLevel(this.userID, this.selected)
          .pipe(
            switchMap((cards) =>
              of((cards as Array<Paginated>)[0].paginatedResults)
            )
          );
      } else if (this.selectedWord === 'studied') {
        this.cards = this.electronicBookService
          .getCardsUserStudiedLevel(this.userID, this.selected)
          .pipe(
            switchMap((cards) =>
              of((cards as Array<Paginated>)[0].paginatedResults)
            )
          );
      }
    }
    this.isEmpty = true
    this.cards.subscribe(cards => {
      if(cards.length < 1){
        this.isEmpty = false;
      }
    })
  }

  changeLevel() {
    this.getCards();
  }

  changeType() {
    this.getCards();
  }

  public startAudioCallGame(): void {
    const group = this.selected;
    this.audioCallGameService.fromWordList = true;
    this.audioCallGameService.dataFromWordList.group = Number(group);
    this.router.navigateByUrl('/audio-call-game');
  }

}
