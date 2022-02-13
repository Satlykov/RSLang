import { Component, Input, OnInit } from '@angular/core';
import { Word } from 'src/app/models/interface';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})
export class WordCardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
