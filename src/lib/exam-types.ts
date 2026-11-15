export type Question = {
  subject: string;
  q: string;
  options: string[];
  /** Position of the right option, starting from 0. */
  answer: number;
  explanation?: string;
};

export type Exam = {
  slug: string;
  title: string;
  description?: string;
  /** Minutes. */
  duration: number;
  marksPerQuestion: number;
  negativeMarking: number;
  cutMark?: number;
  instructions: string[];
  subjects: { name: string; count: number }[];
  questions: Question[];
};

export type ExamSummary = {
  slug: string;
  title: string;
  description?: string;
  duration: number;
  questionCount: number;
  subjectCount: number;
  fullMarks: number;
};
