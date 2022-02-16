import { Component, Input, OnInit } from '@angular/core';
import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss'],
})
export class WordCardComponent implements OnInit {
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
}
