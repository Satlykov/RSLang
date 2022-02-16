import { Component, Input, OnInit } from '@angular/core';
import { backendURL } from 'src/app/constants/backendURL';
import { UserWord, Word } from 'src/app/models/interface';
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

  constructor(
    private userWordService: UserWordService,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authorizationService.authenticated;
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
    this.hard = true;
    this.userWordService.postUserWord(this.card.id, obj).subscribe((res) => {
      console.log(res);
    });
  }

  deletHard() {
    this.hard = false;
    this.userWordService.deleteUserWord(this.card.id).subscribe((res) => {
      console.log(res);
    });
  }

  cheakHard() {
    this.userWordService.getUserWord(this.card.id).subscribe((word) => {
      if ((word as UserWord).difficulty === 'hard') {
        this.hard = true;
      }
    });
  }

  toggleHard() {
    if (this.hard) {
      this.deletHard();
    } else {
      this.addToHard();
    }
  }
}
