"use client";

import { useSyncExternalStore } from "react";
import ExamInfo from "./ExamInfo";
import ExamPaper from "./ExamPaper";
import ExamResult from "./ExamResult";
import { useExamSession } from "@/hooks/useExamSession";
import { t } from "@/lib/exam-text";
import type { Exam } from "@/lib/exam-types";

const noop = () => () => {};

/** Runs the three phases of one exam: info, exam, result. */
export default function ExamRunner({ exam }: { exam: Exam }) {
  const { session, start, answer, submit, leave } = useExamSession(exam.slug, exam.questions.length);

  // Saved progress only exists in the browser; wait for it so the screen doesn't flash.
  const ready = useSyncExternalStore(noop, () => true, () => false);
  if (!ready) return <p className="px-6 py-24 text-center text-soft">{t.loading}</p>;

  if (session.phase === "exam" && session.startedAt !== null) {
    return (
      <ExamPaper
        exam={exam}
        answers={session.answers}
        startedAt={session.startedAt}
        onAnswer={answer}
        onSubmit={submit}
      />
    );
  }

  if (session.phase === "result" && session.startedAt !== null && session.finishedAt !== null) {
    return (
      <ExamResult
        exam={exam}
        answers={session.answers}
        startedAt={session.startedAt}
        finishedAt={session.finishedAt}
        onLeave={leave}
      />
    );
  }

  return <ExamInfo exam={exam} onStart={start} />;
}
