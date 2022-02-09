import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';

@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit {

  public isOpened:boolean = false;
  public id: number = 0;
  public currentWordsPack: Word[] = [];
  private forRandomAnsers: String[] = [];

  constructor(
  private audioCallGameService: AudioCallGameService,
  ) {}

  ngOnInit(): void {
    this.getRandomAnswers();
  }

  public showQuestions(id: number):void {
    this.currentWordsPack = []
    this.isOpened = !this.isOpened
    this.audioCallGameService.getQuestions(id)
      .subscribe(response =>{
        const data = response as Word[];
        data.forEach(element => this.currentWordsPack.push(element))
      })
    console.log(this.currentWordsPack)
  }

  private getRandomAnswers():void {
    for(let id = 0; id<=5; id++){
      this.audioCallGameService.getQuestions(id)
        .subscribe(response =>{
          const words = response as Word[];
          words.forEach(element => this.forRandomAnsers.push(element.word))
        })
    }
    this.forRandomAnsers = [...new Set(this.forRandomAnsers)]
  }
}
