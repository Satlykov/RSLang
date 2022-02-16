import { Component, OnInit } from '@angular/core';
import { UserWordService } from 'src/app/services/user-word.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export class WordListComponent implements OnInit {
  constructor(private userWordService: UserWordService) {}

  ngOnInit(): void {
    this.userWordService.getUserWords().subscribe((words) => {
      console.log(words);
    });
  }
}
