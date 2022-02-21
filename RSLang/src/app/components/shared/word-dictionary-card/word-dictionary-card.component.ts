import { Component, Input, OnInit } from '@angular/core';
import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';
import { UserWordService } from 'src/app/services/user-word.service';
import { WordListComponent } from 'src/app/pages/word-list/word-list.component';

@Component({
  selector: 'app-word-dictionary-card',
  templateUrl: './word-dictionary-card.component.html',
  styleUrls: ['./word-dictionary-card.component.scss'],
})
export class WordDictionaryCardComponent implements OnInit {
  @Input() card!: Word;
  @Input() index!: number;
  @Input() cards!: Word[];

  closed = false;
  constructor(
    private userWordService: UserWordService,
    private wordListComponent: WordListComponent
  ) {}

  ngOnInit(): void {}

  playWord(src: string) {
    let audio = new Audio();
    audio.src = backendURL + '/' + src;
    audio.load();
    audio.volume = 0.5;
    audio.play();
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

  deleteHard() {
    this.userWordService.deleteUserWord(this.card._id).subscribe(() => {
      this.wordListComponent.getCards();
    });
  }
}
