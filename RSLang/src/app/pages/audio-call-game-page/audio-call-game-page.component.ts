import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Word } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';

/*Вопросики:
Как все это перенести в сервис, что должно быть в компоненте, что в сервисе?
Можно ли юзать один и тот же сабжект в разных подписках?
Что такое горячий и холодный обсервбл
*/

@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit, OnDestroy {

  public isOpened = false;
  public id = 0;
  public questionsList: Word[] = [];
  private randomWords: string[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
  private audioCallGameService: AudioCallGameService,
  ) {}

  ngOnInit(): void {
    this.audioCallGameService.randomWords$
      .pipe(
        takeUntil(this.unsubscribe$),
        take(1)
      )
      .subscribe(randomWords => {
        this.randomWords = randomWords;
        console.log(this.randomWords)
      })
    this.audioCallGameService.loadRandomWords();
  }


  ngOnDestroy():void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.questionsList = [];
    this.isOpened = !this.isOpened
    this.audioCallGameService.getQuestionsList(id);
      this.audioCallGameService.questionsList$
      .pipe(
        take(1)
      )
      .subscribe( questionsList => {
        this.questionsList = questionsList;
      })
  }
}
