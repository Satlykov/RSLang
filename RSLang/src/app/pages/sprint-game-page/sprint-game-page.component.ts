import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { backendURL } from 'src/app/constants/backendURL';
import { Word } from 'src/app/models/interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { SprintGameService } from 'src/app/services/sprint-game.service';
import { UserWordService } from 'src/app/services/user-word.service';
@Component({
  selector: 'app-sprint-game-page',
  templateUrl: './sprint-game-page.component.html',
  styleUrls: ['./sprint-game-page.component.scss'],
})
export class SprintGamePageComponent implements OnInit {
  authenticated = false;
  userID = '';
  sprintStatus = false;
  valueSpinner = 0;
  startSecond = 5;
  startSecondStatus = false;
  endSprint = false;
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
  percent = 0;
  soundEfect = true;
  spinerTime = 5500;
  getCounter = 0;

  private subsWords: Subscription = new Subscription();
  private subsStreak: Subscription = new Subscription();
  private subsScore: Subscription = new Subscription();
  private subsPercent: Subscription = new Subscription();

  levels = [
    { value: 'group=0', viewValue: 'A1 Elementary' },
    { value: 'group=1', viewValue: 'A2 Pre-Intermediate' },
    { value: 'group=2', viewValue: 'B1 IIntermediate' },
    { value: 'group=3', viewValue: 'B2 Upper-Intermediate' },
    { value: 'group=4', viewValue: 'C1 Advanced' },
    { value: 'group=5', viewValue: 'C2 Proficiency' },
  ];

  constructor(
    private sprintGameService: SprintGameService,
    private authorizationService: AuthorizationService,
    private userWordService: UserWordService
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.sprintStatus) {
      if (event.key === 'ArrowLeft') {
        this.cheackAnswer(false);
      }

      if (event.key === 'ArrowRight') {
        this.cheackAnswer(true);
      }
    }
  }

  ngOnInit(): void {
    this.authenticated = this.authorizationService.checkLogin();
    this.userID = this.authorizationService.getUserID();
    this.subsWords = this.sprintGameService.sprintWords$.subscribe(
      (words: Word[]) => {
        this.wordsSprint = words;
        this.cheackLengthWords();
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
    this.subsScore = this.sprintGameService.score$.subscribe(
      (score: number) => {
        this.score = score;
      }
    );
    this.subsPercent = this.sprintGameService.percent$.subscribe((percent) => {
      this.percent = percent;
    });
    this.fromBook();
    this.sprintGameService.getStat(this.userID);
  }

  ngOnDestroy(): void {
    this.subsWords.unsubscribe();
    this.subsStreak.unsubscribe();
    this.subsScore.unsubscribe();
    this.subsPercent.unsubscribe();
    this.closeSprint();
  }

  startSprint(select?: string, page?: number) {
    if (select && page) {
      this.selected = select;
      this.page = page;
    }
    this.getWords();
    this.startSeconds();
    setTimeout(() => {
      this.wordToComponetn();
      this.startSecondStatus = false;
      this.sprintStatus = true;
      this.sprintGameService.stopWatch(60).subscribe((sec: number) => {
        this.gameSecond = 60 - sec;
        if (this.gameSecond === 0) {
          this.stopSprint();
        }
      });
    }, this.spinerTime);
  }

  stopSprint() {
    this.sprintStatus = false;
    this.endSprint = true;
  }

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
    if (this.page === 30) {
      this.page = 0;
    }
    if (this.authenticated) {
      if (this.sprintGameService.fromBook) {
        this.sprintGameService.getUserWordsFromeBook(
          this.userID,
          this.selected.split('=')[1],
          this.page
        );
      } else {
        this.sprintGameService.getUserWords(
          this.userID,
          this.selected.split('=')[1],
          this.page
        );
      }
    } else {
      this.sprintGameService.getWords(this.selected, this.page);
    }
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
    if (this.soundEfect) {
      if (answer === this.translateWord) {
        this.correct();
      } else {
        this.wrong();
      }
    }
    this.nextWord();
  }

  nextWord() {
    this.indexWord += 1;
    this.wordToComponetn();
    this.cheackLengthWords();
  }

  sound() {
    let audio = new Audio();
    audio.src = `${backendURL}/${
      (this.wordsSprint[this.indexWord] as Word).audio
    }`;
    audio.load();
    audio.volume = 0.5;
    audio.play();
  }

  correct() {
    let audio = new Audio();
    audio.src = '../../../assets/mp3/correct.mp3';
    audio.load();
    audio.volume = 0.1;
    audio.play();
    const obj = {
      difficulty: 'studied',
      optional: {},
    };
    if (
      (this.wordsSprint[this.indexWord] as Word).userWord?.difficulty === 'hard'
    ) {
      this.userWordService
        .putUserWord((this.wordsSprint[this.indexWord] as Word)._id, obj)
        .subscribe(() => {});
    } else {
      this.userWordService
        .postUserWord((this.wordsSprint[this.indexWord] as Word)._id, obj)
        .subscribe(() => {});
    }
  }

  wrong() {
    let audio = new Audio();
    audio.src = '../../../assets/mp3/wrong.mp3';
    audio.load();
    audio.volume = 0.1;
    audio.play();
    const obj = {
      difficulty: 'hard',
      optional: {},
    };
    if (
      (this.wordsSprint[this.indexWord] as Word).userWord?.difficulty ===
      'studied'
    ) {
      this.userWordService
        .putUserWord((this.wordsSprint[this.indexWord] as Word)._id, obj)
        .subscribe(() => {});
    } else {
      this.userWordService
        .postUserWord((this.wordsSprint[this.indexWord] as Word)._id, obj)
        .subscribe(() => {});
    }
  }

  fromBook() {
    if (this.sprintGameService.fromBook) {
      this.startSprint(
        this.sprintGameService.selected,
        this.sprintGameService.numberPage
      );
    }
  }

  cheackLengthWords() {
    if (
      this.indexWord >= this.wordsSprint.length - 10 &&
      this.getCounter < 31
    ) {
      this.page += 1;
      this.getCounter += 1;
      this.getWords();
    } else {
      this.getCounter = 0;
    }
  }

  closeSprint() {
    this.sprintGameService.closeSprint();
    this.sprintStatus = false;
    this.valueSpinner = 0;
    this.startSecond = 5;
    this.startSecondStatus = false;
    this.endSprint = false;
    this.enWord = '';
    this.ruWord = '';
    this.translateWord = true;
    this.indexWord = 0;
    this.indexTranslate = 0;
    this.page = 0;
    this.pointsForAnswer = 10;
    this.gameSecond = 60;
    this.streakAnswers = 0;
    this.score = 0;
    this.star = 1;
    this.sprintGameService.fromBook = false;
  }
}
