import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Word } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';

/*Вопросики:
Как все это перенести в сервис, что должно быть в компоненте, что в сервисе?
Можно ли юзать один и тот же сабжект в разных подписках?
*/

@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit, OnDestroy {

  public isOpened = false;
  public id = 0;
  public currentWordsPack: Word[] = [];
  private randomWords: String[] = [];
  private randomWordsSubject = new Subject<void>();

  private unsubscribe$ = new Subject<void>();

  get temp$():Observable<void>{
    return this.randomWordsSubject.asObservable()
  }

  constructor(
  private audioCallGameService: AudioCallGameService,
  ) {}

  ngOnInit(): void {
    this.getRandomWords();
    this.randomWordsSubject
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(()=>{
      this.getRandomOptions()
      })
  }

  ngOnDestroy():void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getRandomWords():void {
    for(let id = 0; id<=5; id++){
      this.audioCallGameService.getQuestions(id)
        .pipe(
          take(1)
        )
        .subscribe(response =>{
          const words = response as Word[];
          words.forEach(element => this.randomWords.push(element.word))
          if(this.randomWords.length === 120){
            this.randomWordsSubject.next();
          }
        })
    }
  }

  private getRandomOptions():String[] {
    const randomOptions: String[] = [];
    while(randomOptions.length < 4){
      const randomNum = Math.floor(Math.random() * (this.randomWords.length + 1))
      randomOptions.push(this.randomWords[randomNum])
    }
    const randomNum = Math.floor(Math.random() * (this.randomWords.length + 1))
    console.log(randomOptions)
    return randomOptions
  }

  public showQuestions(id: number):void {
  this.currentWordsPack = []
  this.isOpened = !this.isOpened
  this.audioCallGameService.getQuestions(id)
    .pipe(
      take(1)
    )
    .subscribe(response =>{
      const data = response as Word[];
      data.forEach(element => this.currentWordsPack.push(element));
      // if(this.currentWordsPack.length === 20){
      //   this.randomWordsSubject.next();
      // }
      console.log(this.currentWordsPack)
    })
  }

}
