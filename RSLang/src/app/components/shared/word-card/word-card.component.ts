import { Component, Input, OnInit } from '@angular/core';

import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';
import { ElectronicBookPageComponent } from 'src/app/pages/electronic-book-page/electronic-book-page.component';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { UserWordService } from 'src/app/services/user-word.service';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss'],
})
export class WordCardComponent implements OnInit {
  @Input() card!: Word;
  authenticated = false;
  hard = false;
  studied = false;

  constructor(
    private userWordService: UserWordService,
    private authorizationService: AuthorizationService,
    private electronicBookPageComponent: ElectronicBookPageComponent,
    private statistics: StatisticsService
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authorizationService.checkLogin();
    this.cheakWord();
    this.statistics.putStat();
  }

  playWord(src: string) {
    let audio = new Audio();
    audio.src = backendURL + '/' + src;
    audio.load();
    audio.volume = 0.5;
    audio.play();
  }

  addToHard() {
    const obj = {
      difficulty: 'hard',
      optional: {},
    };
    this.statistics.addToHard();
    this.userWordService.postUserWord(this.card._id, obj).subscribe(
      () => {
        this.hard = true;
        this.electronicBookPageComponent.getCards();
      },
      (error) => {
        this.hard = false;
      }
    );
  }

  addStudied() {
    const obj = {
      difficulty: 'studied',
      optional: {},
    };
    this.statistics.addToStudied();
    this.userWordService.postUserWord(this.card._id, obj).subscribe(
      () => {
        this.studied = true;
        this.electronicBookPageComponent.getCards();
      },
      (error) => {
        this.studied = false;
      }
    );
  }

  deletHard() {
    this.userWordService.deleteUserWord(this.card._id).subscribe(
      () => {
        this.hard = false;
        this.electronicBookPageComponent.getCards();
      },
      (error) => {
        this.hard = true;
      }
    );
  }

  deletStudied() {
    this.userWordService.deleteUserWord(this.card._id).subscribe(
      () => {
        this.studied = false;
        this.electronicBookPageComponent.getCards();
      },
      (error) => {
        this.studied = true;
      }
    );
  }

  cheakWord() {
    if (this.card.userWord) {
      this.hard = this.card.userWord.difficulty === 'hard';
      this.studied = this.card.userWord.difficulty === 'studied';
    }
  }

  toggleHard() {
    if (this.hard) {
      this.deletHard();
    } else {
      this.addToHard();
    }
  }

  toggleStudied() {
    if (this.studied) {
      this.deletStudied();
    } else {
      this.addStudied();
    }
  }

  playAll() {
    let audioN = new Audio();
    const tracks = [
      this.card.audio,
      this.card.audioMeaning,
      this.card.audioExample,
    ];
    let current = 0;
    audioN.src = backendURL + '/' + tracks[current];
    audioN.volume = 0.5;
    audioN.play();
    audioN.onended = function () {
      current++;
      audioN.src = backendURL + '/' + tracks[current];
      audioN.volume = 0.5;
      audioN.play();
      if (current === 2) return;
    };
  }
}
