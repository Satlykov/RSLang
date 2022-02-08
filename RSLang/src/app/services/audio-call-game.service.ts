import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Word } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AudioCallGameService {

  constructor(
    private apiService: ApiService
  ) {}

  getQuestions() {
    return this.apiService.get('words?group=5&page=1')
  }
}
