"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import ResultCards from "./ResultCards";
import MarkSheet from "./MarkSheet";
import QuestionReview from "./QuestionReview";
import { t } from "@/lib/exam-text";
import { scoreExam } from "@/lib/exam-score";
import type { Exam } from "@/lib/exam-types";

type Props = {
  exam: Exam;
  answers: number[];
  startedAt: number;
  finishedAt: number;
  onLeave: () => void;
};

/** Phase 3: score cards, mark sheet by subject, then every question with the right answer. */
export default function ExamResult({ exam, answers, startedAt, finishedAt, onLeave }: Props) {
  const result = useMemo(() => scoreExam(exam, answers), [exam, answers]);
  const usedMs = Math.min(finishedAt, startedAt + exam.duration * 60_000) - startedAt;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold leading-snug tracking-tight text-ink">{exam.title}</h1>

      <ResultCards result={result} cutMark={exam.cutMark} usedMs={usedMs} />
      <MarkSheet result={result} />
      <QuestionReview exam={exam} answers={answers} verdicts={result.verdicts} />

      <div className="mt-12 flex flex-wrap gap-3 border-t border-rule pt-6">
        <button
          type="button"
          onClick={onLeave}
          className="rounded-md bg-ink px-5 py-2.5 font-semibold text-paper hover:opacity-90"
        >
          {t.retake}
        </button>
        <Link href="/live-exam" className="rounded-md border border-rule px-5 py-2.5 text-ink hover:bg-ink/5">
          {t.allExams}
        </Link>
      </div>
    </div>
  );
}
