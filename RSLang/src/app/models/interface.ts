export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Word {
  id: string;
  _id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  answersOptions?: string[];
  userWord?: {
    difficulty?: string;
    optional?: {};
  };
}

export interface UserWord {
  difficulty: string;
  optional: {};
}

export interface Statistic {
  learnedWords: number;
  optional: OptionalStatistic;
}

export interface StatisticDelete {
  learnedWords: number;
  optional: {};
}

export interface OptionalStatistic {
  stat: {
    days: [Day];
  };
}

export interface Day {
  date: string;
  studyDay: number;
  words: WordStatistic;
  sprint: GamesStatistic;
  audio: GamesStatistic;
  book: BookStatistic;
}

export interface WordStatistic {
  newWords: number;
  studiedWords: number;
  studiedWordsDay: number;
  correctAnswersPercentage: number;
}

export interface GamesStatistic {
  newWords: number;
  gamesDay: number;
  correctAnswersPercentageDay: number[];
  percentageDay: number;
  longestStreak: number;
}

export interface BookStatistic {
  newWords: number;
  notedHard: number;
  notedStudied: number;
}
export interface Setting {
  wordsPerDay: number;
  optional: {};
}

export interface Auth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
export interface AudioGameStatictic {
  correct: {
    word: string[];
    translation: string[];
    audioPath: string[];
  };
  incorrect: {
    word: string[];
    translation: string[];
    audioPath: string[];
  };
}
export interface Paginated {
  paginatedResults: Word[];
}

export interface Chart {
  name: string,
  value: number
}
