import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Word } from 'src/app/models/interface';
import { SprintGameService } from 'src/app/services/sprint-game.service';
@Component({
  selector: 'app-sprint-game-page',
  templateUrl: './sprint-game-page.component.html',
  styleUrls: ['./sprint-game-page.component.scss'],
})
export class SprintGamePageComponent implements OnInit {
  sprintStatus = false;
  valueSpinner = 0;
  startSecond = 5;
  startSecondStatus = false;
  gameSecond = 60;
  selected = 'group=0';
  wordsSprint: Word[] = [];
  enWord = '';
  ruWord = '';
  translateWord = true;
  indexWord = 0;
  indexTranslate = 0;
  page = 0;
  streakAnswers = 0;
  star = 1;
  score = 0;
  pointsForAnswer = 10;

  private subsWords: Subscription = new Subscription();
  private subsStreak: Subscription = new Subscription();
  private subsScore: Subscription = new Subscription();

  levels = [
    { value: 'group=0', viewValue: 'Уровень 1' },
    { value: 'group=1', viewValue: 'Уровень 2' },
    { value: 'group=2', viewValue: 'Уровень 3' },
    { value: 'group=3', viewValue: 'Уровень 4' },
    { value: 'group=4', viewValue: 'Уровень 5' },
    { value: 'group=5', viewValue: 'Уровень 6' },
  ];

  constructor(private sprintGameService: SprintGameService) {}

  ngOnInit(): void {
    this.subsWords = this.sprintGameService.sprintWords$.subscribe(
      (words: Word[]) => {
        this.wordsSprint = words;
      }
    );
    this.subsStreak = this.sprintGameService.streak$.subscribe(
      (streak: number) => {
        this.streakAnswers = streak;
        this.star = Math.floor(streak / 3) + 1;
        if (this.star > 5) {
          this.star = 5;
        }
      }
    );
    this.subsScore = this.sprintGameService.score$.subscribe((score: number) => {
      this.score = score;
    })
  }

  ngOnDestroy(): void {
    this.subsWords.unsubscribe();
    this.subsStreak.unsubscribe();
  }

  startSprint() {
    this.getWords();
    this.startSeconds();
    setTimeout(() => {
      this.wordToComponetn();
      this.startSecondStatus = false;
      this.sprintStatus = true;
      const gameSecondInterval = setInterval(() => {
        this.gameSecond -= 1;
        if (this.gameSecond === 0) {
          clearInterval(gameSecondInterval);
        }
      }, 1000);
    }, 5500);
  }

  stopSprint() {}

  startSeconds() {
    this.startSecondStatus = true;
    let myInterval = setInterval(() => {
      this.startSecond -= 1;
      this.valueSpinner = 100 - 20 * this.startSecond;
      if (this.startSecond === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
  }

  getWords() {
    this.sprintGameService.getWords(this.selected, this.page);
  }

  wordToComponetn() {
    this.enWord = (this.wordsSprint[this.indexWord] as Word).word;
    this.ruWord = (
      this.wordsSprint[this.getTranslateIndex()] as Word
    ).wordTranslate;
  }

  getTranslateIndex() {
    if (Math.random() >= 0.5) {
      this.indexTranslate = this.indexWord;
      this.translateWord = true;
    } else {
      this.translateWord = false;
      this.indexTranslate = this.getRandom(this.wordsSprint.length);
      while (this.indexWord === this.indexTranslate) {
        this.indexTranslate = this.getRandom(this.wordsSprint.length);
      }
    }
    return this.indexTranslate;
  }

  getRandom(max: number) {
    return Math.floor(Math.random() * (max - 1));
  }

  cheackAnswer(answer: boolean) {
    this.sprintGameService.cheackAnswer(answer, this.translateWord);
    this.nextWord();
  }

  nextWord() {
    this.indexWord += 1;
    this.wordToComponetn();
    if (this.indexWord === this.wordsSprint.length - 10) {
      this.page += 1;
      this.getWords();
    }
  }
}
