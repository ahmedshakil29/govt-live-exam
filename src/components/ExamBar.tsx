"use client";

import { cn } from "@/lib/utils";
import { t } from "@/lib/exam-text";
import { formatClock } from "@/lib/exam-score";

type Props = {
  remainingMs: number;
  answers: number[];
  onJump: (index: number) => void;
  onSubmit: () => void;
};

export default function ExamBar({ remainingMs, answers, onJump, onSubmit }: Props) {
  const answered = answers.filter((a) => a >= 0).length;
  const low = remainingMs <= 5 * 60_000;

  return (
    <div className="sticky top-14 z-20 -mx-5 border-b border-rule bg-paper px-5 py-2 sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-4">
        <span
          role="timer"
          className={cn("font-mono text-xl tabular-nums", low ? "font-semibold text-bad" : "text-ink")}
        >
          {formatClock(remainingMs)}
        </span>
        <span className="text-sm text-soft">
          {t.answered}: {answered}/{answers.length}
        </span>
        <button
          type="button"
          onClick={onSubmit}
          className="ml-auto rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
        >
          {t.submit}
        </button>
      </div>

      <details>
        <summary className="cursor-pointer list-none py-1 text-sm text-soft hover:text-ink">{t.questionList}</summary>
        <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto py-2">
          {answers.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`${t.questions} ${i + 1}`}
              className={cn(
                "size-8 rounded border text-xs",
                a >= 0 ? "border-accent bg-accent text-paper" : "border-rule text-soft hover:text-ink",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
