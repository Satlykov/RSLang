import { Component, Input, OnInit } from '@angular/core';

import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
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
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authorizationService.checkLogin();
    this.cheakWord();
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
    this.userWordService.postUserWord(this.card._id, obj).subscribe(
      () => {
        this.hard = true;
      },
      (error) => {
        this.hard = false;
      }
    );
  }

  deletHard() {
    this.userWordService.deleteUserWord(this.card._id).subscribe(
      () => {
        this.hard = false;
      },
      (error) => {
        this.hard = true;
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

  playAll() {
    let audioN = new Audio();
    const tracks = [this.card.audio, this.card.audioMeaning, this.card.audioExample];
    let current = 0;
    if ('pause' in audioN) audioN.pause();
    audioN.src = backendURL + '/' + tracks[current];
    audioN.load();
    audioN.volume = 0.5;
    audioN.play();
    audioN.onended = function () {
      current++;
      audioN.src = backendURL + '/' + tracks[current];
      audioN.load();
      audioN.volume = 0.5;
      audioN.play();
      if (current >= tracks.length) return;
    };
  }
}
