import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit {

  public isOpened:boolean = false
  public id: number = 0

  constructor() { }

  ngOnInit(): void {
  }

  public showQuestions(id: number):void {
    this.isOpened = !this.isOpened
    console.log(id)
  }

}
