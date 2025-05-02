import type { Answer } from './Answer';

export interface Question {
  _id: string;
  question: string;
  answers: Answer[];
}
