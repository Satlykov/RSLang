import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  public cards!: Observable<any>;

  numberPage = 0;
  plusPage = true;
  minusPage = false;

  private subsCards: Subscription = new Subscription();

  constructor(private electronicBookService: ElectronicBookService) {}

  ngOnInit(): void {
    this.getCards();
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
    this.getCards();
  }
}
