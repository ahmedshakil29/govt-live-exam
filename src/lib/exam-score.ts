import type { Exam } from "./exam-types";

export type Verdict = "correct" | "wrong" | "skipped";

export type SubjectStat = {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  marks: number;
};

export type ExamResultData = {
  subjects: SubjectStat[];
  totals: Omit<SubjectStat, "subject">;
  fullMarks: number;
  /** null when the exam has no cut mark. */
  passed: boolean | null;
  verdicts: Verdict[];
};

const round = (n: number) => Math.round(n * 100) / 100;

/** 54.750 -> "54.75", 9 -> "9" */
export const formatMarks = (n: number) => String(Number(n.toFixed(2)));

/** Milliseconds -> "5:07" or "1:05:07" */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function scoreExam(exam: Exam, answers: number[]): ExamResultData {
  const stats = new Map<string, SubjectStat>(
    exam.subjects.map((s) => [
      s.name,
      { subject: s.name, total: 0, correct: 0, wrong: 0, skipped: 0, marks: 0 },
    ]),
  );

  const verdicts = exam.questions.map((question, i): Verdict => {
    const stat = stats.get(question.subject)!;
    const picked = answers[i] ?? -1;
    stat.total++;
    if (picked < 0) {
      stat.skipped++;
      return "skipped";
    }
    if (picked === question.answer) {
      stat.correct++;
      return "correct";
    }
    stat.wrong++;
    return "wrong";
  });

  const subjects = [...stats.values()].map((s) => ({
    ...s,
    marks: round(s.correct * exam.marksPerQuestion - s.wrong * exam.negativeMarking),
  }));

  const sum = (key: "total" | "correct" | "wrong" | "skipped" | "marks") =>
    subjects.reduce((n, s) => n + s[key], 0);

  const totals = {
    total: sum("total"),
    correct: sum("correct"),
    wrong: sum("wrong"),
    skipped: sum("skipped"),
    marks: round(sum("marks")),
  };

  return {
    subjects,
    totals,
    fullMarks: round(exam.questions.length * exam.marksPerQuestion),
    passed: exam.cutMark === undefined ? null : totals.marks >= exam.cutMark,
    verdicts,
  };
}
