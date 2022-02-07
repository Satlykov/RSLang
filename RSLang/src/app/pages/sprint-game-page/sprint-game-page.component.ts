import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sprint-game-page',
  templateUrl: './sprint-game-page.component.html',
  styleUrls: ['./sprint-game-page.component.scss'],
})
export class SprintGamePageComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getWords();
  }

  getWords() {
    this.api.get('words?group=5&page=1').subscribe((words) => {
      console.log(words);
    });
  }
}
