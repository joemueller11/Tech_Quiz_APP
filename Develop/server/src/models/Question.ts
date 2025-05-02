import { Schema, model, type Document } from 'mongoose';

interface IAnswer extends Document {
  text: string;
  isCorrect: boolean;
}

interface IQuestion extends Document {
  question: string;
  answers: IAnswer[];
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  answers: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
});

const Question = model<IQuestion>('Question', QuestionSchema);
export { IQuestion, Question };
