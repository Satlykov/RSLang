import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Word } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AudioCallGameService {

  private maxPage = 29;
  private minPage = 0;

  constructor(
    private apiService: ApiService
  ) {}

  getQuestions(group: number):Observable<Object> {
    const path = this.getPath(group);
    return this.apiService.get(path)
  }

  getPath(group: number):string{
  const page = Math.floor(Math.random() * (this.maxPage - this.minPage + 1)) + this.minPage
  return `words?group=${group}&page=${page}`
  }

}
