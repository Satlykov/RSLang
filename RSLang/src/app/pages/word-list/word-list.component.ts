import { Component, OnInit } from '@angular/core';
import { UserWordService } from 'src/app/services/user-word.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export class WordListComponent implements OnInit {
  constructor(private userWordService: UserWordService) {}

  selected: string = 'all';
  selectedWord: string = 'hard';

  levels = [
    { value: 'all', viewValue: 'All' },
    { value: 'group=0', viewValue: 'A1 Elementary' },
    { value: 'group=1', viewValue: 'A2 Pre-Intermediate' },
    { value: 'group=2', viewValue: 'B1 Intermediate' },
    { value: 'group=3', viewValue: 'B2 Upper-Intermediate' },
    { value: 'group=4', viewValue: 'C1 Advanced' },
    { value: 'group=5', viewValue: 'C2 Proficiency' },
  ];

  types = [
    { value: 'hard', viewValue: 'Сложные' },
    { value: 'studied', viewValue: 'Изученные' },
  ]
  ngOnInit(): void {
    this.userWordService.getUserWords().subscribe((words) => {
      console.log(words);
    });
  }

  getCards() {

  }

  changeLevel() {
    this.getCards();
  }

  changeType() {
    this.getCards();
  }
}
