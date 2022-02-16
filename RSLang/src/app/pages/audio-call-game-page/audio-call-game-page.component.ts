import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Word, AudioGameStatictic } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';
import * as _ from 'lodash';
import { backendURL } from 'src/app/constants/backendURL'


@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit, OnDestroy {

  public section = 'question';
  public isOpened = false;
  public isAnswered = false;
  public isCorrect = false;
  public showStatistic = false;
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
    answersOptions:['','','','','']
  };
  private currentIndex: number = 0;
  public backendURL = backendURL;
  public statistic: AudioGameStatictic = {
    correct : {
      word: [],
      translation: [],
      audioPath: [],
    },
    incorrect : {
      word: [],
      translation: [],
      audioPath: [],
    }
  }


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
      this.statistic = {
        correct:{
          word: [],
          translation: [],
          audioPath: [],
        },
        incorrect:{
          word: [],
          translation: [],
          audioPath: [],
        }
      }
      this.currentIndex = 0;
      this.questionsList = [];
      this.section = 'question';
      return
    }
    this.questionsList = [];
    this.section = 'answers';
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
    const correct = this.statistic.correct;
    const incorrect = this.statistic.incorrect;
    const currentQuestion = this.currentQuestion;
    this.isAnswered = !this.isAnswered
    if( this.currentQuestion.wordTranslate === answer){
      this.isCorrect = true;
      correct.word.push(currentQuestion.word);
      correct.translation.push(currentQuestion.wordTranslate);
      correct.audioPath.push(currentQuestion.audio);
    }else{
      this.isCorrect = false;
      incorrect.word.push(currentQuestion.word);
      incorrect.translation.push(currentQuestion.wordTranslate);
      incorrect.audioPath.push(currentQuestion.audio);
    }
  }

  public nextQuestion():void {
    this.isAnswered = !this.isAnswered
    if(this.currentIndex < this.questionsList.length-1){
      this.currentIndex++;
      this.generateQuestion(this.questionsList,this.currentIndex)
    }else{
      this.currentIndex = 0;
      this.section = 'statistic';
    }
  }

}
