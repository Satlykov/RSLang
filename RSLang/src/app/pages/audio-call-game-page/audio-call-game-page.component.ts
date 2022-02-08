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

  public isOpened:boolean = false
  public id: number = 0
  // public temp: string = ''
  // public temp2: string = ''

  constructor(
  private aduioCallGameService: AudioCallGameService,
  private http: HttpClient
  ) {}

  ngOnInit(): void {
    // this.http.get<Word[]>('https://rslangsteam.herokuapp.com/words?group=5&page=1')
    //   .subscribe(response =>{
        // const words = JSON.parse(JSON.stringify(response)) ;
        // console.log(words[0])
        // this.temp = words[0].audio
      //   console.log(response)
      //   const words = response
      //   const temp = words[0]
      //   console.log(temp)
      // })
    this.aduioCallGameService.getQuestions()
    .subscribe(response =>{
      console.log(response)
    })
    console.log('hi')
  }

  public showQuestions(id: number):void {
    this.isOpened = !this.isOpened
    console.log(id)
  }

  public checkResponse():void{

  }
}
