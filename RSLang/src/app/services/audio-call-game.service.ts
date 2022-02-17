import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { ApiService } from './api.service';
import { Word } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AudioCallGameService {

  private maxPage = 29;
  private minPage = 0;
  private randomWords: string[] = [];
  private randomWordsSubject = new Subject<string[]>();
  private questionsListSubject = new Subject<Word[]>();
  public fromBook = false;
  public dataFromBook = {
    group:0,
    page:0
  }

  get randomWords$(): Observable<string[]> {
    return this.randomWordsSubject.asObservable();
  }
  get questionsList$(): Observable<Word[]> {
    return this.questionsListSubject.asObservable();
  }

  constructor(
    private apiService: ApiService
  ) {}



  public getQuestions(group: number, page?: number|undefined):Observable<Object> {
    let path = ''
    if(page !== undefined){
      path = `words?group=${group}&page=${page}`
    }else{
      path = this.getPath(group);
    }
    return this.apiService.get(path)
  }

  public loadRandomWords():void {
    this.getRandomWords()
  }

  public getQuestionsList(group : number, page?: number|undefined): void {
    this.getQuestions(group,page)
      .pipe(
        take(1)
      )
      .subscribe( words => {
        const data = words as Word[]
        data.forEach(element => {
          const randomOptions: string[] = [];
          while(randomOptions.length < 4){
            const randomNum = Math.floor(Math.random() * (this.randomWords.length))
            randomOptions.push(this.randomWords[randomNum])
          }
          element.answersOptions = randomOptions
        })
        this.questionsListSubject.next(data)
      })
  }

  private getPath(group: number):string{
  const page = Math.floor(Math.random() * (this.maxPage - this.minPage + 1)) + this.minPage
  return `words?group=${group}&page=${page}`
  }

  private getRandomWords():void {
    for(let id = 0; id<=5; id++){
      this.getQuestions(id)
        .pipe(
          take(1)
        )
        .subscribe(response =>{
          const words = response as Word[];
          words.forEach(element => this.randomWords.push(element.wordTranslate))
          if(this.randomWords.length === 120){
            this.randomWordsSubject.next(this.randomWords);
          }
        })
    }
  }

  public shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


}
