import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Word } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';
import * as _ from 'lodash';
import { backendURL } from 'src/app/constants/backendURL'


@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit, OnDestroy {

  public isOpened = false;
  public isAnswered = false;
  public id = 0;
  public questionsList: Word[] = [];
  private randomWords: string[] = [];
  private unsubscribe$ = new Subject<void>();
  public currentQuestion: Word = {
    id: '1',
    group: 1,
    page: 1,
    word: 'word',
    image:'',
    audio:'',
    audioMeaning:'',
    audioExample:'',
    textMeaning:'',
    textExample:'',
    transcription:'',
    wordTranslate:'',
    textMeaningTranslate:'',
    textExampleTranslate:'',
    answersOptions:['word1','word1','word1','word1','word1']
  };
  private currentIndex: number = 0;
  public backendURL = backendURL;


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


  public showQuestions(id: number):void {
    if(id === 7){
      this.questionsList = [];
      this.isOpened = !this.isOpened
      return
    }
    this.questionsList = [];
    this.isOpened = !this.isOpened
    this.audioCallGameService.getQuestionsList(id);
      this.audioCallGameService.questionsList$
      .pipe(
        take(1)
      )
      .subscribe( questionsList => {
        this.questionsList = questionsList;
        this.generateQuestion(this.questionsList,this.currentIndex);
      })
  }

  private generateQuestion(array: Word[], index:number):void {
    this.currentQuestion = _.cloneDeep(array[index])
    const result = _.cloneDeep(array[index].answersOptions);
    result?.push(array[index].wordTranslate)
    this.audioCallGameService.shuffle(result!);
    this.currentQuestion.answersOptions = result;
    this.generateAudio(this.currentQuestion.audio)
  }

  public generateAudio(path: string):void {
    const audio = new Audio();
    audio.src = `${this.backendURL}/${path}`;
    audio.load();
    audio.play();
  }

  public checkAnswer(answer: string):void {
    this.isAnswered = !this.isAnswered
    if( this.currentQuestion.wordTranslate === answer){
      console.log(true)
    }else{
      console.log(false)
    }
  }

  public nextQuestion():void {
    this.isAnswered = !this.isAnswered
    if(this.currentIndex < this.questionsList.length-1){
      this.currentIndex++;
      this.generateQuestion(this.questionsList,this.currentIndex)
    }else{
      this.currentIndex = 0;
      this.isOpened = !this.isOpened
    }
  }
}
