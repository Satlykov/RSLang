import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Word, AudioGameStatictic } from 'src/app/models/interface';
import { AudioCallGameService } from 'src/app/services/audio-call-game.service';
import * as _ from 'lodash';
import { backendURL } from 'src/app/constants/backendURL';
import { sections, KEY_CODE } from 'src/app/enums.ts/enums';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserWordService } from 'src/app/services/user-word.service';


@Component({
  selector: 'app-audio-call-game-page',
  templateUrl: './audio-call-game-page.component.html',
  styleUrls: ['./audio-call-game-page.component.scss']
})
export class AudioCallGamePageComponent implements OnInit, OnDestroy {

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.section === sections.answers){
      if(event.keyCode === KEY_CODE.first && !this.isAnswered){
        this.checkAnswer(this.currentQuestion.answersOptions![0]);
      }
      if(event.keyCode === KEY_CODE.second && !this.isAnswered){
        this.checkAnswer(this.currentQuestion.answersOptions![1]);
      }
      if(event.keyCode === KEY_CODE.third && !this.isAnswered){
        this.checkAnswer(this.currentQuestion.answersOptions![2]);
      }
      if(event.keyCode === KEY_CODE.forth && !this.isAnswered){
        this.checkAnswer(this.currentQuestion.answersOptions![3]);
      }
      if(event.keyCode === KEY_CODE.fifth && !this.isAnswered){
        this.checkAnswer(this.currentQuestion.answersOptions![4]);
      }
      if(event.keyCode === KEY_CODE.back){
        this.showQuestions(7,false);
      }
      if(event.keyCode === KEY_CODE.confirm){
        this.nextQuestion();
      }
    }
  }

  public isAuthenticated = false;
  private userID = '';
  public section = sections.questions;
  public isOpened = false;
  public isAnswered = false;
  public isCorrect = false;
  public showStatistic = false;
  public id = 0;
  public questionsList: Word[] = [];
  private randomWords: string[] = [];
  public percent = 0;
  public currentStreak = 0;
  public maxSreak = 0
  private unsubscribe$ = new Subject<void>();
  public currentQuestion: Word = {
    id: '1',
    _id: '1',
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

  backColors = [
    'linear-gradient(90deg, rgba(36,29,253,1) 0%, rgba(39,255,0,1) 100%)',
    'linear-gradient(90deg, rgba(34,102,195,1) 0%, rgba(253,247,45,1) 100%)',
    'linear-gradient(90deg, rgba(253,85,29,1) 0%, rgba(252,176,69,1) 100%)',
    'linear-gradient(90deg, rgba(175,29,253,1) 0%, rgba(69,252,225,1) 100%)',
    'linear-gradient(90deg, rgba(253,29,109,1) 0%, rgba(69,239,252,1) 100%)',
    'linear-gradient(90deg, rgba(253,29,29,1) 0%, rgba(69,252,179,1) 100%)',
    'radial-gradient(circle, rgba(244,251,63,1) 0%, rgba(252,70,70,1) 100%)',
  ];

  backColor = this.backColors[1];


  constructor(
  private audioCallGameService: AudioCallGameService,
  private authorizationService: AuthorizationService,
  private userWordService: UserWordService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authorizationService.checkLogin();
    this.userID = this.authorizationService.getUserID();
    this.audioCallGameService.randomWords$
      .pipe(
        takeUntil(this.unsubscribe$),
        take(1)
      )
      .subscribe(randomWords => {
        this.randomWords = randomWords;
      })
    this.audioCallGameService.loadRandomWords();
    this.startFromBook();
    this.startFromWorldList();
  }


  ngOnDestroy():void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public showQuestions(group: number, fromWordList: boolean, page?: number|undefined,authorization?: boolean|undefined, userID?: string|undefined):void {
    if(group === 7){
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
      this.section = sections.questions;
      return
    }
    this.questionsList = [];
    this.section = sections.answers;
    this.audioCallGameService.getQuestionsList(group,fromWordList,page,authorization,userID);
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

  private correct(word: Word): void {
    let id = word._id;
    if(!id){
      id = word.id
    }
    const obj = {
      difficulty: 'studied',
      optional: {},
    };
    if(word.userWord?.difficulty !== undefined){
      this.userWordService
        .putUserWord(id,obj)
        .subscribe(() => {});
    }
    else{
      this.userWordService
      .postUserWord(id,obj)
      .subscribe(() => {});
    }
  }

  private wrong(word: Word): void{
    let id = word._id;
    if(!id){
      id = word.id
    }
    const obj = {
      difficulty: 'hard',
      optional: {},
    };
    if(word.userWord?.difficulty !== undefined){
      this.userWordService
        .putUserWord(id,obj)
        .subscribe(() => {});
    }
    else{
      this.userWordService
      .postUserWord(id,obj)
      .subscribe(() => {});
    }
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
      this.correct(this.currentQuestion)
      this.isCorrect = true;
      this.currentStreak++;
      if(this.maxSreak < this.currentStreak){
        this.maxSreak = this.currentStreak
      }
      correct.word.push(currentQuestion.word);
      correct.translation.push(currentQuestion.wordTranslate);
      correct.audioPath.push(currentQuestion.audio);
    }else{
      this.wrong(this.currentQuestion)
      this.isCorrect = false;
      this.currentStreak = 0;
      incorrect.word.push(currentQuestion.word);
      incorrect.translation.push(currentQuestion.wordTranslate);
      incorrect.audioPath.push(currentQuestion.audio);
    }
  }

  public nextQuestion():void {
    const correct = this.statistic.correct;
    const incorrect = this.statistic.incorrect;
    this.isAnswered = !this.isAnswered
    if(this.currentIndex < this.questionsList.length-1){
      this.currentIndex++;
      this.generateQuestion(this.questionsList,this.currentIndex)
    }else{
      this.currentIndex = 0;
      this.section = sections.statistic;
      this.percent = correct.word.length/(correct.word.length + incorrect.word.length) * 100;
      console.log(this.maxSreak)
    }
  }

  public startFromBook(): void {
    if(this.audioCallGameService.fromBook){
      this.showQuestions(this.audioCallGameService.dataFromBook.group,this.audioCallGameService.fromWordList,this.audioCallGameService.dataFromBook.page,this.isAuthenticated,this.userID)
      this.section = sections.answers
    }
  }

  public startFromWorldList(): void {
    if(this.audioCallGameService.fromWordList){
      this.showQuestions(this.audioCallGameService.dataFromWordList.group,this.audioCallGameService.fromWordList,this.audioCallGameService.dataFromBook.page,this.isAuthenticated,this.userID,)
      this.section = sections.answers
    }
  }
}
