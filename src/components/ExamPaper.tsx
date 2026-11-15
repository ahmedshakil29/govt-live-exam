"use client";

import { useEffect, useState } from "react";
import ExamBar from "./ExamBar";
import QuestionCard from "./QuestionCard";
import ConfirmDialog from "./ConfirmDialog";
import { t } from "@/lib/exam-text";
import type { Exam } from "@/lib/exam-types";

type Props = {
  exam: Exam;
  answers: number[];
  startedAt: number;
  onAnswer: (index: number, choice: number) => void;
  onSubmit: () => void;
};

/** Phase 2: every question on one page, with a countdown. */
export default function ExamPaper({ exam, answers, startedAt, onAnswer, onSubmit }: Props) {
  const deadline = startedAt + exam.duration * 60_000;
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);

  // Tick every second; submit automatically when time runs out.
  useEffect(() => {
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) onSubmit();
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, onSubmit]);

  const unanswered = answers.filter((a) => a < 0).length;

  const jump = (index: number) =>
    document.getElementById(`q-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-6">
      <h1 className="pb-4 pt-8 text-2xl font-semibold leading-snug tracking-tight text-ink">{exam.title}</h1>

      <ExamBar
        remainingMs={Math.max(0, deadline - now)}
        answers={answers}
        onJump={jump}
        onSubmit={() => setConfirming(true)}
      />

      <div className="mt-4 space-y-4">
        {exam.questions.map((question, i) => (
          <QuestionCard
            key={i}
            mode="exam"
            index={i}
            question={question}
            picked={answers[i] ?? -1}
            onPick={(choice) => onAnswer(i, choice)}
            onClear={() => onAnswer(i, -1)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-md bg-ink px-6 py-3 font-semibold text-paper hover:opacity-90"
        >
          {t.submit}
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          title={t.confirmTitle}
          confirmLabel={t.confirmYes}
          cancelLabel={t.confirmNo}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onSubmit();
          }}
        >
          <p>{unanswered > 0 ? t.confirmUnanswered(unanswered) : t.confirmAllDone}</p>
          <p>{t.confirmWarning}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
