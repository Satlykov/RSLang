import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Word } from 'src/app/models/interface';
import { ElectronicBookService } from 'src/app/services/electronic-book.service';

@Component({
  selector: 'app-electronic-book-page',
  templateUrl: './electronic-book-page.component.html',
  styleUrls: ['./electronic-book-page.component.scss'],
})
export class ElectronicBookPageComponent implements OnInit {
  selected = 'group=0';
  levels = [
    { value: 'group=0', viewValue: 'A1 Elementary' },
    { value: 'group=1', viewValue: 'A2 Pre-Intermediate' },
    { value: 'group=2', viewValue: 'B1 IIntermediate' },
    { value: 'group=3', viewValue: 'B2 Upper-Intermediate' },
    { value: 'group=4', viewValue: 'C1 Advanced' },
    { value: 'group=5', viewValue: 'C2 Proficiency' },
  ];

  public cards: Word[] = [];

  numberPage = 0;

  private subsCards: Subscription = new Subscription();

  constructor(private electronicBookService: ElectronicBookService) {}

  ngOnInit(): void {
    this.subsCards = this.electronicBookService.cardsBook$.subscribe(
      (cards: Word[]) => {
        this.cards = cards;
      }
    );
    this.getCards();
  }

  ngOnDestroy(): void {
    this.subsCards.unsubscribe();
  }

  getCards() {
    this.electronicBookService.getCards(this.selected, this.numberPage);
  }
}
