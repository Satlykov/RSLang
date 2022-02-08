import { Component, OnInit } from '@angular/core';
import { SprintGameService } from 'src/app/services/sprint-game.service';
@Component({
  selector: 'app-sprint-game-page',
  templateUrl: './sprint-game-page.component.html',
  styleUrls: ['./sprint-game-page.component.scss'],
})
export class SprintGamePageComponent implements OnInit {
  sprintStatus = false;
  valueSpinner = 0;
  startSecond = 5;
  startSecondStatus = false;
  gameSecond = 60;

  constructor(private sprintGameService: SprintGameService) {}

  ngOnInit(): void {}

  startSprint() {
    this.startSeconds();
    setTimeout(() => {
      this.startSecondStatus = false;
      this.sprintStatus = true;
      const gameSecondInterval = setInterval(() => {
        this.gameSecond -= 1;
        if (this.gameSecond === 0) {
          clearInterval(gameSecondInterval);
        }
      }, 1000);
    }, 5500);
  }

  stopSprint() {}

  startSeconds() {
    this.startSecondStatus = true;
    let myInterval = setInterval(() => {
      this.startSecond -= 1;
      this.valueSpinner = 100 - 20 * this.startSecond;
      if (this.startSecond === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
  }
}
