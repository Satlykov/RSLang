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
  public randomWords: String[] = [];
  public randomWordsSubject = new Subject<void>();

  constructor(
    private apiService: ApiService
  ) {}



  public getQuestions(group: number):Observable<Object> {
    const path = this.getPath(group);
    return this.apiService.get(path)
  }

  private getPath(group: number):string{
  const page = Math.floor(Math.random() * (this.maxPage - this.minPage + 1)) + this.minPage
  return `words?group=${group}&page=${page}`
  }



  // public getRandomWords(): String[]{
  //   for(let id = 0; id<=5; id++){
  //     this.getQuestions(id)
  //       .pipe(
  //         take(1)
  //       )
  //       .subscribe(response =>{
  //         const words = response as Word[];
  //         words.forEach(element => this.randomWords.push(element.word))
  //         if(this.randomWords.length === 120){
  //           this.randomWordsSubject.next();
  //         }
  //       })
  //   }
  //   return this.randomWords
  // }

  // public getRandomOptions():void {
  //   console.log(this.getRandomWords())
  // }

}
