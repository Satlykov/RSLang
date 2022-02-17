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
  optional: {};
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
