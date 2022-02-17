import { Component, Input, OnInit } from '@angular/core';
import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';

@Component({
  selector: 'app-word-dictionary-card',
  templateUrl: './word-dictionary-card.component.html',
  styleUrls: ['./word-dictionary-card.component.scss'],
})
export class WordDictionaryCardComponent implements OnInit {
  @Input() card!: Word;
  constructor() {}

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
